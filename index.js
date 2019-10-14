const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
var bodyParser = require('body-parser')

const { Pool } = require('pg');
// var pool = new Pool({
//   user: 'graceluo',
//   password: 'tokicorgi',
//   host: 'localhost',
//   database: 'tokimonDB'
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:true
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/tokidex'))
app.get('/add', (req, res) => res.render('pages/add'))

// app.get('/tokimons', (req,res) => {
//   var getUsersQuery = `SELECT * FROM tokimondata`;
//   console.log(getUsersQuery);
//   pool.query(getUsersQuery, (error, result) => {
//     if (error)
//       res.end(error);
//     var results = {'rows': result.rows};
//     console.log(results);
//     res.render('pages/tokidex',results);
//     //send response and object over to users.ejs
//   });
// });

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
      //res.send(`deleted: ${req.params.name}`)
      // const deleted = { 'results': (result) ? result.rows : null};
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
      //res.send(`deleted: ${req.params.name}`)
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
  // var sql = `UPDATE tokimondata SET trainer = req.body.trainer, height = req.body.height, weight = req.body.weight,
  //   electric = req.body.electric, fight = req.body.fight, fire = req.body.fire, fly = req.body.fly, water = req.body.water, ice = req.body.ice,
  //   food = req.body.food WHERE name = '${req.params.name}'`;
  var sql = `UPDATE tokimondata SET trainer = $1, height = $2, weight = $3,
    electric = $4, fight = $5, fire = $6, fly = $7, water = $8, ice = $9,
    food = $10, total = $11 WHERE name = '${req.params.name}'`;

  pool.query(sql, value, (err, result)=> {
    if (err) throw err;
    res.render('pages/updateSuccess');
    console.log("tokimon updated!");
  });
})

// app.post('/update/:name', async (req, res) => {
//     try {
//       const client = await pool.connect()
//       console.log(req.params.name);
//       //res.send(`tokimon name: ${req.params.name}`);
//       const result = await client.query(`UPDATE tokimondata SET trainer = req.body.trainer, height = req.body.height, weight = req.body.weight,
//         electric = req.body.electric, fight = req.body.fight, fire = req.body.fire, fly = req.body.fly, water = req.body.water, ice = req.body.ice,
//         food = req.body.food WHERE name = '${req.params.name}'`);
//       //res.send(`deleted: ${req.params.name}`)
//        const results = { 'results': (result) ? result.rows : null};
//        res.render('pages/updateSuccess', results);
//       client.release();
//     } catch (err) {
//       console.error(err);
//       res.send("Error " + err);
//     }
//   })

app.post('/add', (req,res) => {
  console.log("ok");
  const total = parseInt(req.body.electric)+parseInt(req.body.fight)+parseInt(req.body.fire)+parseInt(req.body.fly)+parseInt(req.body.water)+parseInt(req.body.ice);
  //++++;
  console.log(total);
  var value = [req.body.tokimonName,req.body.trainer,req.body.height,req.body.weight,req.body.electric,req.body.fight,req.body.fire,req.body.fly,req.body.water,req.body.ice,req.body.food,parseInt(req.body.electric)+parseInt(req.body.fight)+parseInt(req.body.fire)+parseInt(req.body.fly)+parseInt(req.body.water)+parseInt(req.body.ice)];
  // var tokiname = req.body.tokimonName;
  // var trainer = req.body.trainer;
  // var height = req.body.height;
  // var weight = req.body.weight;
  // var electric = req.body.electric;
  // var fight = req.body.fight;
  // var fire = req.body.fire;
  // var fly = req.body.fly;
  // var water = req.body.water;
  // var ice = req.body.ice;
  // var favFood = req.body.food;
  //
  // //res.send(`tokimon name: ${tokiname}`);
  //
  // console.log(tokiname);
  // console.log(trainer);
  // console.log(height);
  // console.log(weight);
  // console.log(electric);
  // console.log(fight);
  // console.log(fire);
  // console.log(fly);
  // console.log(water);
  // console.log(ice);
  // console.log(favFood);

  // const inner_results = await client.query('insert into login (id,username,password) values ($1,$2,$3)',value);

  var sql = 'INSERT INTO tokimondata (name,trainer,height,weight,electric,fight,fire,fly,water,ice,food,total) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)';
  pool.query(sql, value, (err, result)=> {
    if (err) throw err;
    res.render('pages/addSuccess');
    console.log("tokimon added!");
  });


})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
