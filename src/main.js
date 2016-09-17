import React from 'react';
import { render } from 'react-dom';
import App from 'components/App';


const person = prompt("please enter a username")
render(<App person={person}/>, document.getElementById('app'));
