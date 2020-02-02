const express = require('express');
var bodyParser = require('body-parser')
const app = express();//.use(bodyParser.json());

const port = process.env.PORT || 3000;    


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());


const routes = require('./api/routes');
routes(app);
app.listen(port, function() {
   console.log('Server started on port: ' + port);
});
