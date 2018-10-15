import Color from 'color';

{
const init = event => {
	[].forEach.call( document.getElementsByClassName( 'color-shift' ), element => {
		const hslArray = ( new Color( window.getComputedStyle( element ).backgroundColor ) ).hsl().array();
		hslArray[1] = hslArray[1] + '%';
		hslArray[2] = hslArray[2] + '%';
		shiftBackgroundColor( element, hslArray );
	} );
};

const shiftBackgroundColor = ( element, nextHSL, frame = 0 ) => {
	if ( frame > 30 ) {
		element.style.backgroundColor = 'hsl(' + nextHSL.join( ',' )  + ')';
		if ( nextHSL[0] > 359 ) {
			nextHSL[0] = 0;
		} else {
			nextHSL[0]++;
		}
		frame = 0;
	} else {
		frame++;
	}
	window.requestAnimationFrame( () => shiftBackgroundColor( element, nextHSL, frame ) );
};

if ( 'complete' === document.readyState || 'interactive' === document.readyState ) {
	init( document.readyState );
} else if ( document.addEventListener ) {
	document.addEventListener( 'DOMContentLoaded', init ); 
} else if ( document.attachEvent ) {
	document.attachEvent( 'onload', init ); 
}
}
