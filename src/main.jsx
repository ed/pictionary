import React from 'react';
import { render } from 'react-dom';
import 'css/style.css';
import WhiteBoard from 'components/WhiteBoard';
import MessageSection from 'components/MessageSection';

render(
	<MessageSection />,
	//<WhiteBoard />, 
	document.getElementById('app'));
