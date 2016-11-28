var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cors = require('cors');

var app = express();

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'polls'
});

connection.connect(function(err){
    if(!err)
	    console.log("database is connected...");
    else
        console.log("error connecting database");
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(session({ secret: 'tupapa', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));
var session;
app.post('/login', function(req, res) {
	console.log('POST /login');
	console.log('paramas: ' + JSON.stringify(req.body.user));
	console.log(JSON.stringify(req.body));
	connection.query('select * from users where password = ? limit 1', [req.body.user.password], function(err, rows){
		if(!err){
			session = req.body.user;
			session.user_id = rows[0].id_user;
			res.json({user: rows[0], message: 'ok', error: 'nop'});
		}else{
			res.json({smessage: 'No Se Encontro al usuario', error: 'yup'});
		}
	})
});

app.get('/mobile_services/get_all_polls_user', function(req, res){
	console.log('GET /mobile_services/get_all_polls_user');
	if(session){
		connection.query("select * from my_polls where user_id = ?", [session.user_id], function(err, rows){
			if(!err){
				res.json({
					polls: rows,
					message: 'ok',
					error: 'nop',
				});
			}else{
				res.json({smessage: 'No Se encontraros encuestas', error: 'yup'});
			}
		});
	}else{
		res.json({smessage: 'es necesario iniciar sesion', error: 'yup'});
	}
});

app.listen(3000, function(){
        console.log('app listening on http://localhost/ on port 3000');
});
