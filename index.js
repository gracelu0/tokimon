const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();
var bodyParser = require('body-parser')

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:false
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/tokidex'))
app.get('/add', (req, res) => res.render('pages/add'))

app.post('/add', (req,res) => {
  console.log("ok");
  var tokiname = req.body.tokimonName;
  var trainer = req.body.trainer;
  var height = req.body.height;
  var weight = req.body.weight;
  var electric = req.body.electric;
  var fight = req.body.fight;
  var fire = req.body.fire;
  var fly = req.body.fly;
  var water = req.body.water;
  var ice = req.body.ice;
  var favFood = req.body.food;
  res.send(`tokimon name: ${tokiname}`);

  console.log(tokiname);
  console.log(trainer);
  console.log(height);
  console.log(weight);
  console.log(electric);
  console.log(fight);
  console.log(fire);
  console.log(fly);
  console.log(water);
  console.log(ice);
  console.log(favFood);

  var sql = `INSERT INTO tokimondata (name,trainer,height,weight,electric,fight,fire,fly,water,ice,food) VALUES (tokiname, trainer, height, weight, electric, fight, fire, fly, water,ice,favFood)`;

  pool.query(sql, (err,result)=> {
    if (err) throw err;
    console.log("1 tokimon added");
  })
  pool.end();

})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
