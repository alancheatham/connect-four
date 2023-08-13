require('./ConnectFourPeg.less');

// dependencies
import React, { Component } from 'react';
import Hammer               from 'react-hammerjs';
import cn                   from 'classnames';

const classesDefault = [];
const onClickDefault = () => {};
const beadsDefault   = [];
const idDefault      = 0;
const loserDefault   = false;

const ConnectFourPeg = ({
	classes = classesDefault,
	onClick = onClickDefault,
	beads   = beadsDefault,
	id      = idDefault,
	loser   = loserDefault
}) => {

	const className = cn(['peg'], { loser });
	
	let n = 0; 
	const renderBeads = [];

	for (let i = 0; i < beads.length; i++) {
		if (beads[i] === 'W') {
			renderBeads.push(
				<div className='bead' style={{'bottom': 20 * i}} key={n++}></div>
			);
		}
			
		else {
			renderBeads.push(
				<div className='bead black' style={{'bottom': 20 * i}} key={n++}></div>
			);
		}
	}

	return (
		<Hammer onTap={() => onClick(id)}>
			<div className={className}>
				{renderBeads}
			</div>
		</Hammer>
	);
};

export default ConnectFourPeg;