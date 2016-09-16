import React from 'react';
import { render } from 'react-dom';
import 'css/style.css';
import MessageSection from './components/MessageSection';

const person = prompt("please enter a username") || 'fat_nerd';
const drawer = 'edward'

render(
	<MessageSection user={person} drawer={drawer} />,
	document.getElementById('app'));
