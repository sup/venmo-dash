var express = require('express');
var app = express();
var morgan = require('morgan');

app.set('port', (process.env.PORT || 3000));
app.use(morgan('dev'));
app.use(express.static('./public'));

require('./app/routes.js')(app);

app.listen(app.get('port'), function() {
    console.log("listening on port: "+app.get('port'));
});
