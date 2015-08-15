var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var request = require('request');
var async = require('async');


app.set('port', (process.env.PORT || 3000));
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'hacktheplanet',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, request, async, passport);

app.listen(app.get('port'), function() {
    console.log("listening on port: "+app.get('port'));
});
