'use strict'

  /*
   *   Run 'npm run build' to run production envioronment
   */

const port = (process.env.PORT || 3000);
const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
app.use( bodyParser.json() ); 

module.exports = () => {
	const indexPath = path.join(__dirname, '..' , '..' ,'index.html')
	const publicPath = express.static(path.join(__dirname, '..' , '..' , '/bin'))

	app.use('/bin', publicPath)
	app.get('/', (_, res) => { res.sendFile(indexPath) });

	var server = require('http').Server(app);
	var io = require('./socket')(server);

	var roomManager = require('./roomManager')(app, io);
	return server;
}