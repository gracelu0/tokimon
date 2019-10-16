const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
var bodyParser = require('body-parser')

const { Pool } = require('pg');


//Production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:true
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(errorHandler)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/tokidex'))
app.get('/add', (req, res) => res.render('pages/add'))

function errorHandler(err,req,res,next){
  res.status(500)
  res.render('error', {error:err})
}

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM tokimondata');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.get('/individuals', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM tokimondata');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/individuals', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.get('/tokimon/:name', async (req, res) => {
    try {
      const client = await pool.connect()
      console.log(req.params.name);
      //res.send(`tokimon name: ${req.params.name}`);
      const result = await client.query(`SELECT * FROM tokimondata WHERE name = '${req.params.name}'`);
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/viewTokimon', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.get('/deleteTokimon/:name', async (req, res) => {
    try {
      const client = await pool.connect()
      console.log(req.params.name);
      //res.send(`tokimon name: ${req.params.name}`);
      const result = await client.query(`DELETE FROM tokimondata WHERE name = '${req.params.name}'`);
       res.render('pages/deleteSuccess');
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.get('/edit/:name', async (req, res) => {
    try {
      const client = await pool.connect()
      console.log(req.params.name);
      //res.send(`tokimon name: ${req.params.name}`);
      const result = await client.query(`SELECT * FROM tokimondata WHERE name = '${req.params.name}'`);
       const results = { 'results': (result) ? result.rows : null};
       res.render('pages/edit', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

app.post('/update/:name', (req,res)=> {
  console.log(req.body);
  var value = [req.body.trainer,req.body.height,req.body.weight,req.body.electric,req.body.fight,req.body.fire,req.body.fly,req.body.water,req.body.ice,req.body.food,parseInt(req.body.electric)+parseInt(req.body.fight)+parseInt(req.body.fire)+parseInt(req.body.fly)+parseInt(req.body.water)+parseInt(req.body.ice)];
  var sql = `UPDATE tokimondata SET trainer = $1, height = $2, weight = $3,
    electric = $4, fight = $5, fire = $6, fly = $7, water = $8, ice = $9,
    food = $10, total = $11 WHERE name = '${req.params.name}'`;

  pool.query(sql, value, (err, result)=> {
    if (err) res.render('pages/updateError');
    res.render('pages/updateSuccess');
    console.log("tokimon updated!");
  });
})

app.post('/sort', (req,res)=> {
  console.log("attribute",req.body.attributes);
  var attribute = req.body.attributes;
  var sql = `SELECT * FROM tokimondata ORDER BY ${req.body.attributes} DESC`;


  pool.query(sql, (err, result)=> {
    if (err) throw err;
    const results = { 'results': (result) ? result.rows : null};
    console.log(results);
    console.log("att:",attribute);
    if (attribute=="Weight"){
      res.render('pages/dbSortWeight', results );
    }
    else if (attribute=="Total"){
      res.render('pages/dbSortTotal', results );
    }
    else if (attribute=="Height"){
      res.render('pages/dbSortHeight', results );
    }

  });
})


app.post('/add', (req,res) => {
  if(req.body.name == ''){
    res.render('pages/error');
  }
  console.log("ok");
  const total = parseInt(req.body.electric)+parseInt(req.body.fight)+parseInt(req.body.fire)+parseInt(req.body.fly)+parseInt(req.body.water)+parseInt(req.body.ice);

  console.log(total);
  var value = [req.body.tokimonName,req.body.trainer,req.body.height,req.body.weight,req.body.electric,req.body.fight,req.body.fire,req.body.fly,req.body.water,req.body.ice,req.body.food,parseInt(req.body.electric)+parseInt(req.body.fight)+parseInt(req.body.fire)+parseInt(req.body.fly)+parseInt(req.body.water)+parseInt(req.body.ice)];

  var sql = 'INSERT INTO tokimondata (name,trainer,height,weight,electric,fight,fire,fly,water,ice,food,total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
  pool.query(sql, value, (err, result)=> {
    //if (err) throw err;
    if (err) res.render('pages/addError');
    res.render('pages/addSuccess');
    console.log("tokimon added!");
  });


})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
