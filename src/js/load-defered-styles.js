document.addEventListener( 'DOMContentLoaded', event => {
	[
		'css/defered.min.css',
	].forEach( path => {
		const link = document.createElement('link');
		link.setAttribute( 'href', path );
		link.setAttribute( 'rel', 'stylesheet' );
		document.getElementsByTagName( 'head' )[0].appendChild( link );
	} );
} );
