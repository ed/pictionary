import React from 'react';
import { render } from 'react-dom';
import 'css/style.css';
import WhiteBoard from 'components/whiteBoard';
import MessageSection from 'components/MessageSection';

render(<MessageSection />, document.getElementById('app'));
//render(<WhiteBoard />, document.getElementById('app')); 
