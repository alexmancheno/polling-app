var pg = require('pg');
var express = require('express');
var bodyParser = require('body-parser');
var one = 1;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', './views');

var dbURL = process.env.DATABASE_URL || 'postgres:localhost:5432/polling_app_db';
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.render('homepage');
})

app.get('/create-poll', function(req, res) {
    res.render('create_poll');
})

app.post('/create-poll', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        console.log(req.body);
        var poll_question = req.body.poll_question;
        var choices_array = req.body.choice;
        var votes = Array.apply(null, Array(choices_array.length)).map(Number.prototype.valueOf,0);
        var author = req.body.author;
        client.query(`insert into polls (poll_question, choices, votes, author) values ('${poll_question}', '{${choices_array}}', '{${votes}}', '${author}')`, function(err, result) {
            res.redirect('/vote');
            done();
            pg.end();
        })
    })
})

app.get('/vote', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        client.query(`select * from polls`, function(err, result) {
            res.render('vote/index', {data: result.rows})
            done();
            pg.end();
        })
    })
})

app.get('/vote/:id', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        var poll_id = req.params.id;
        client.query(`select * from polls where id='${poll_id}'`, function(err, result) {
            res.render('vote/vote', {data: result.rows[0]})
            done();
            pg.end();
        })
    })
})

app.post('/vote/:id', function(req, res) {
        pg.connect(dbURL, function(err, client, done) {
            console.log(req.body);
            var poll_id = req.body.poll_id;
            var vote_id = req.body.optradio;
            client.query(`update polls set votes['${vote_id}'] = (votes['${vote_id}'] + 1) where id = '${poll_id}'`, function(err, result) {
                res.redirect('/vote');
                done();
                pg.end();
            })
        })
})

app.get('/results', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        client.query(`select * from polls`, function(err, result) {
            res.render('results/index', {data: result.rows})
            done();
            pg.end();
        })
    })
})

app.get('/results/:id', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        var poll_id = req.params.id;
        client.query(`select * from polls where id='${poll_id}'`, function(err, result) {
            res.render('results/result', {data: result.rows[0]})
            done();
            pg.end();
        })
    })
})

app.get('/get-poll-data/:id', function(req, res) {
    pg.connect(dbURL, function(err, client, done) {
        console.log("back-end poll id: "+req.params.id);
        var poll_id = req.params.id;
        client.query(`select * from polls where id='${poll_id}'`, function(err, result) {
            res.send(result.rows[0]);
        })
    })
})

app.listen(port, function() {
    console.log("Polling app... is running!!!!!!!!");
})
