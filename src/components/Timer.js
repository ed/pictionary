import React, { Component } from 'react';
import Circle from './Circle';

const Timer = ({ progress, text, strokeWidth=9, trailWidth=10, color="#FF3232", containerStyle }) => {
  return (
    <div style={{fontSize: '800%', position: 'absolute', margin: 0, left: '50%', top:'50%', marginRight: '-50%', transform: 'translate(-50%, -50%)', color: 'white',
   textShadow:
       '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'}}>
    <div className="animated zoomIn">{text}</div>
    </div>
  )
}

export const SmallTimer = ({ progress, text, strokeWidth=9, trailWidth=10, color="#FF3232", containerStyle }) => (
  <div className="timer" style={{display: 'block', position: 'absolute', borderRadius: '50%', width: '50px', margin: 'auto', marginTop: '10px', background:'white', left:0, right:0}}>
  <Circle
        progress={progress}
        options={{
          strokeWidth,
          color,
          duration: progress === 1 ? 700 : 1000,
          text: { value: text, style: { width:'60%', textAlign: 'center', color: 'grey', position: 'absolute', top: '20%', left: '20%'} },
          trailColor: '#D6D6D6', trailWidth }}
        initialAnimate={true}
        containerStyle={{ border: '2px solid white', background: 'white', borderRadius: '50%', width: '80px', height: '80px',  ...containerStyle }}
        containerClassName={'.progressbar'} />
  </div>
)

export default Timer;
