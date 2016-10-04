'use strict'

  /*
   *   Run 'npm run build' to run production envioronment
   */

const port = (process.env.PORT || 3000);
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const indexPath = path.join(__dirname, '..' , '..' ,'index.html')
const publicPath = express.static(path.join(__dirname, '..' , '..' , '/bin'))
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/bin', publicPath)
app.get('/', (_, res) => { res.sendFile(indexPath) });


var server = require('http').Server(app);
var io = require('./socket')(server);

var roomManager = require('./roomManager')(app, io);
module.exports = server;