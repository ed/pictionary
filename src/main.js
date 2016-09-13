import React from 'react';
import { render } from 'react-dom';
import 'css/style.css';
import WhiteBoard from './components/WhiteBoard';
import MessageSection from './components/MessageSection';

const person = prompt("please enter a username") || 'fat_nerd';

render(
	<MessageSection user={person}/>,
	//<WhiteBoard />, 
	document.getElementById('app'));
