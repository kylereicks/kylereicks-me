const fs = require( 'fs' );
const sass = require( 'node-sass' );
//const CleanCSS = require( 'clean-css' );
const postcss = require( 'postcss' );
const autoprefixer = require( 'autoprefixer' );
const cssnano = require( 'cssnano' );

const cssDir = 'src/css/';
const scssDir = cssDir + 'scss/';
const cssBuildDir = 'build/css/';

// Build CSS
fs.readdir( scssDir, ( error, files ) => {
	console.log( 'Building CSS' );
	files.forEach( file => {
		if ( ! /^[^_].*\.scss$/.test( file ) ) {
			return;
		}
		console.log( `Processing ${file}` );
		const cssFile = cssDir + file.replace( /\.scss$/, '.css' );
		const cssMinFile = cssDir + file.replace( /\.scss$/, '.min.css' );
		const cssBuildMinFile = cssBuildDir + file.replace( /\.scss$/, '.min.css' );
		sass.render( {
			file: scssDir + file,
			outputStyle: 'expanded',
			outFile: cssFile,
		}, ( error, result ) => {
			if ( ! error ) {
				fs.writeFile( cssFile, result.css, error => {
					if( error ){
						console.log( error );
					} else {
						console.log( `${cssFile} written` );
					}
				});
				postcss( [ autoprefixer, cssnano ] ).process( result.css, { from: cssFile, to: cssMinFile } ).then( result => {
					fs.writeFile( cssMinFile, result.css, error => {
						if( error ){
							console.log( error );
						} else {
							console.log( `${cssMinFile} written` );
						}
					});
					fs.writeFile( cssBuildMinFile, result.css, error => {
						if( error ){
							console.log( error );
						} else {
							console.log( `${cssBuildMinFile} written` );
						}
					});
				});
			} else {
				console.log( error );
			}
		} );
	} );
} );
