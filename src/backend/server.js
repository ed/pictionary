import React from 'react'
import { match, RouterContext } from 'react-router'
import { renderToString } from 'react-dom/server'
import routes from '../../routes'
import {syncHistoryWithStore} from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux'
import configureStore from '../store'
  /*
   *   Run 'npm run build' to run production envioronment
   */

const port = (process.env.PORT || 3000);
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const indexPath = path.join(__dirname, '..' , '..' ,'index.html')
const publicPath = express.static(path.join(__dirname, '..' , '..' , 'bin'))
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/bin', publicPath)

var server = require('http').Server(app);
var io = require('socket.io')(server);

var roomManager = require('./roomManager')(app, io);

app.use((req, res) => {
  const memoryHistory = createHistory(req.originalUrl);
  const store = configureStore(memoryHistory, {});
  const history = syncHistoryWithStore(memoryHistory, store);


  match({ history, routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirect) {
      res.redirect(redirect.pathname + redirect.search)
    } else if (props) {
      const finalState = store.getState()
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...props}/>
        </Provider>
      )
      res.send(renderPage(html, finalState))
    } else {
      res.status(404).send('Not Found')
    }
  })
})

const renderPage = (html, preloadedState) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
	<head>
	<link href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
	<script src="https://use.fontawesome.com/07b9ea0f1c.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js"></script>
	<meta charset="utf-8">
	<title>Pretty Pictures</title>
	<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
	</head>
	<body>
	<div id='app'>${html}</div>
	<script>
	window.__port__ = ${port}
  window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
  </script>
	<script src="../bin/bundle.js"></script>
	</body>
  </html>
  `
}

module.exports = server;