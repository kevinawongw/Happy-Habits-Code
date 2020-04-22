/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var path = require('path');

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'happy_habits',
	user: 'postgres',
	password: 'Shadowclaw3!'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/happyHome.html'));
});

app.get('/view', function(req, res) {
	var query = 'select * from users;';
	db.any(query)
        .then(function (rows) {
            res.render('Habit_View',{
		my_title: "Habit_View",
		data: null,
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            response.render('Habit_View', {
                title: 'Habit_View',
                data: '',
                
            })
        })

});

app.get('/view/checkin', function(req, res) {
	var email = req.query.email;
	console.log(email);
	var password = req.query.password;
	console.log(password);
	var query = "select name, streak from habits where id = (select id from users where email = '" + email + "' and password = '" + password + "');";
	console.log(query);
	db.any(query)
        .then(function (rows) {
            res.render('Habit_View',{
		my_title: "Habit_View",
		data: rows,
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            response.render('Habit_View', {
                title: 'Habit_View',
                data: '',
                
            })
        })

});

app.post('/view/checkin', function(req, res) {
	var Email = req.body.Email;
	console.log(Email);
	var Password = req.body.Password;
	console.log(Password); 
	var insert = "INSERT INTO users(email, password) VALUES('" + Email + "','" + Password + "');";
	var query = "select name, streak from habits where id = (select id from users where email = '" + Email + "' and password = '" + Password + "');";
	db.task('get-everything', task => {
	  return task.batch([
		task.any(insert),
		task.any(query)
	  ]);
	})
        .then(info => {
            res.render('Habit_View',{
		my_title: "Habit_View",
		data: info[1],
			})

        })
        .catch(function (err) {
            // display error message in case an error
            console.log('error', err);
            response.render('Habit_View', {
                title: 'Habit_View',
                data: '',
                
            })
        })

});







app.listen(8000);
console.log('8000 is the magic port');
