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

var pg = require('pg');


const assign = Object.assign
const port = (process.env.PORT || 3000);
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const utils = require('./utils')
const publicPath = express.static(path.join(__dirname, '..' , '..' , 'bin'));
const favicon = require('serve-favicon');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/bin', publicPath);
app.use(favicon(path.join(__dirname,'..' , '..' ,'img','favicon.ico')));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var roomManager = require('./roomManager')(app, io);

let tempUsers = {};

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (username.startsWith('nerd_')) {
    res.status(400).send({message: 'Name cannot start with \'nerd_\''});
  }
  else {
    utils.register(req, res, username, password, (err, next) => {
      if (err) {
        res.status(400).send({message: err.message})
      }
      if (next) {
        res.writeHead(200, {
      		'Set-Cookie': `a=${next.token};max-age=${1*60*60*24*30};HttpOnly;`,
      		'Content-Type': 'text/plain',
        });
        res.end();
      }
    })
  }
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  utils.login(req, res, username, password, (err, token) => {
    if (err) {
      res.status(400).send({message: err.message})
    }
    else if (token) {
  		res.writeHead(200, {
  		  'Set-Cookie': `a=${token};max-age=${1*60*60*24*30};HttpOnly;`,
  		  'Content-Type': 'text/plain',
  		});
	    res.end();
    }
  })
})

app.post('/logout', (req, res) => {
  try {
    utils.cookieMonster(req.headers.cookie, (err, cb) => {
      cb.user.token = ''
    });
  }
  catch(err){}
  res.writeHead(200, {
    'Set-Cookie': `a='';max-age=${0};HttpOnly;`,
    'Content-Type': 'text/plain',
  });
  res.end();
})

app.get('/whoami', (req, res) => {
  // dispatch sets username + status based on cookie
  utils.cookieMonster(req.headers.cookie, (err, cb) => {
    if (err) {
      res.status(400).send({message: err.message})
    }
    else {
      res.send(JSON.stringify(cb.user.username));
    }
  });
})

let userNum = 0;
app.post('/tempUserInfo', (req, res) => {
  // dispatch sets username + status based on cookie
  let { name } = req.body;
  name = name.trim();
  if (name.length < 1) {
    res.send({ err: 'Name cannot be empty'});
  }
  else if (name in tempUsers) {
    res.send({ err: 'Name in use'});
  }
  else {
    tempUsers[name] = true;
    res.send({user: `nerd_${name}`});
  }
  res.end()
})


app.use((req, res) => {
  const preloadedState = {
    root: {
	  cookie: false
    }
  }
  utils.cookieMonster(req.headers.cookie, (err, cb) => {
    if (!err) {
      assign(preloadedState.root, { cookie: true });
    }
    const memoryHistory = createHistory(req.originalUrl);
    const store = configureStore(memoryHistory, preloadedState);
    const history = syncHistoryWithStore(memoryHistory, store);
    match({ history, routes, location: req.url }, (err, redirect, props) => {
      if (err) {
        res.status(500).send({message: err.message})
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
  });
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
	<script src="/../bin/bundle.js"></script>
	</body>
  </html>
  `
}

module.exports = server;
