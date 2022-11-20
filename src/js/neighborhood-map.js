import GEOJSONtoSVG from './lib/geojson-to-svg/geojson-to-svg';

{
const init = event => {
	const container = document.getElementsByTagName( 'main' )[0],
	map = new GEOJSONtoSVG( container, { north: 44.951898, south: 44.897771, west: -93.328990, east: -93.199624 }, { longitudeAdjustment: 0.7 } ),
	layers = {
		'bicycle-pedestrian': '/data/Pedestrian_and_Bicycle_Trails.geojson',
		'street': '/data/MPLS_Centerline.geojson',
		'park': '/data/parks.geojson',
		'water': '/data/water.geojson',
	};
	for ( let layer in layers ){
		let request = new XMLHttpRequest();
		request.open( 'GET', encodeURI( layers[ layer ] ) );
		request.addEventListener( 'load', event => {
			if ( 200 === request.status ) {
				map.addLayer( layer, JSON.parse( request.responseText ) ).sortLayers( [ 'park', 'water', 'bicycle-pedestrian', 'steet', 'transit' ] );
				window.setTimeout( () => {
					map.layers[layer].classList.add('loaded');
				}, 250 );
			}

			map.svg.setAttribute( 'height', parseInt( window.getComputedStyle( container ).height ) - parseInt( window.getComputedStyle([].reduce.call( container.childNodes, ( result, element ) => {
				if ( result ) {
					return result;
				}
				if ( 'HEADER' === element.tagName ) {
					return element;
				}
				return false;
			}, false ) ).height ) );
		} );
		request.send();
	}
	let request = new XMLHttpRequest();
	request.open( 'GET', encodeURI( 'https://api.kylereicks.me/wp-json/transit/VehicleLocations' ) );
	request.addEventListener( 'load', event => {
		if ( 200 === request.status ) {
			const transitData = JSON.parse( request.responseText );
			map.updateLayer( 'transit', {
				type: 'FeatureCollection',
				features: transitData.map( vehicle => {
					return {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [
								vehicle.VehicleLongitude,
								vehicle.VehicleLatitude,
							],
						},
						properties: vehicle,
					};
				} ),
			} );
			[].forEach.call( map.layers.transit.childNodes, circle => {
				const bus = circle.parentNode.appendChild( document.createElementNS( map.svgNS, 'rect' ) ),
				busWidth = circle.classList.contains( 'Direction--4' ) || circle.classList.contains( 'Direction--1' ) ? 4 : 8,
				busHeight = 8 === busWidth ? 4 : 8;

				bus.setAttribute( 'x', circle.getAttribute( 'cx' ) - ( busWidth / 2 ) );
				bus.setAttribute( 'y', circle.getAttribute( 'cy' ) - ( busHeight / 2 ) );
				bus.setAttribute( 'width', busWidth );
				bus.setAttribute( 'height', busHeight );
				bus.setAttribute( 'class', circle.getAttribute( 'class' ) );
				bus.setAttribute( 'data-properties', circle.getAttribute( 'data-properties' ) );
			} );
			window.setTimeout( () => {
				if ( ! map.layers['transit'].classList.contains('loaded') ) {
					map.layers['transit'].classList.add('loaded');
				}
			}, 250 );
		}
	} );
	request.send();
	window.setInterval( () => {
		request.open( 'GET', encodeURI( 'https://api.kylereicks.me/wp-json/transit/VehicleLocations' ) );
		request.send();
	}, 35000 );
};

if ( 'complete' === document.readyState || 'interactive' === document.readyState ) {
	init( document.readyState );
} else if ( document.addEventListener ) {
	document.addEventListener( 'DOMContentLoaded', init ); 
} else if ( document.attachEvent ) {
	document.attachEvent( 'onload', init ); 
}
}
