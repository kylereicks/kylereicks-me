{
const init = event => {
	[].forEach.call( document.getElementsByClassName( 'color-shift' ), element => {

		shiftBackgroundColor( element );
	} );
};

const shiftBackgroundColor = ( element, frame = 0 ) => {
	if ( frame > 30 ) {
		const currentBackgroundHue = window.parseInt( window.getComputedStyle( element ).getPropertyValue('--background-hue') );
		element.style.setProperty('--background-hue', ( currentBackgroundHue >= 360 ? 0 : currentBackgroundHue ) + 1 );
		frame = 0;
	} else {
		++frame;
	}
	window.requestAnimationFrame( () => shiftBackgroundColor( element, frame ) );
};

if ( 'complete' === document.readyState || 'interactive' === document.readyState ) {
	init( document.readyState );
} else if ( document.addEventListener ) {
	document.addEventListener( 'DOMContentLoaded', init ); 
} else if ( document.attachEvent ) {
	document.attachEvent( 'onload', init ); 
}
}
