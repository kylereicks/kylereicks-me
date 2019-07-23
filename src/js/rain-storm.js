{
class RainDrop {
	constructor( svg ) {
		this.svg = svg;
		this.svgBoundingRect = this.svg.getBoundingClientRect();
		this.svgNS = 'http://www.w3.org/2000/svg';
		this.rainDrop = document.createElementNS( this.svgNS, 'ellipse' );
		this.rainDrop.setAttribute( 'class', 'rain-drop' );
		this.rainDrop.setAttribute( 'rx', 2 );
		this.rainDrop.setAttribute( 'ry', 8 );
		this.rainDrop.setAttribute( 'cx', ( Math.floor( Math.random() * Math.floor( this.svgBoundingRect.width * 1.5 ) ) - ( this.svgBoundingRect.width * 0.5 ) ) );
		this.rainDrop.setAttribute( 'cy', -10 );
		this.rainDrop.setAttribute( 'transform', 'skewX( 22 )' );
		this.svg.appendChild( this.rainDrop );
		return this;
	}

	fall() {
		if ( this.rainDrop.getAttribute( 'cy' ) >= this.svgBoundingRect.height || this.rainDrop.getAttribute( 'cx' ) >= this.svgBoundingRect.width ) {
			return this.rainDrop.parentNode.removeChild( this.rainDrop );
		}

		this.rainDrop.setAttribute( 'cy', parseFloat( this.rainDrop.getAttribute( 'cy' ) ) + ( this.svgBoundingRect.height / 30 ) );
		window.requestAnimationFrame( () => this.fall() );
	}
}

class SnowFlake {
	constructor( svg ) {
		this.svg = svg;
		this.svgBoundingRect = this.svg.getBoundingClientRect();
		this.svgNS = 'http://www.w3.org/2000/svg';
		this.snowFlake = document.createElementNS( this.svgNS, 'ellipse' );
		this.snowFlake.setAttribute( 'class', 'snow-flake' );
		this.snowFlake.setAttribute( 'rx', 6 );
		this.snowFlake.setAttribute( 'ry', 8 );
		this.snowFlake.setAttribute( 'cx', ( Math.floor( Math.random() * Math.floor( this.svgBoundingRect.width * 1.5 ) ) - ( this.svgBoundingRect.width * 0.5 ) ) );
		this.snowFlake.setAttribute( 'cy', -10 );
		this.snowFlake.setAttribute( 'transform', 'skewX( 22 )' );
		this.svg.appendChild( this.snowFlake );
		return this;
	}

	fall() {
		if ( this.snowFlake.getAttribute( 'cy' ) >= this.svgBoundingRect.height || this.snowFlake.getAttribute( 'cx' ) >= this.svgBoundingRect.width ) {
			return this.snowFlake.parentNode.removeChild( this.snowFlake );
		}

		this.snowFlake.setAttribute( 'cy', parseFloat( this.snowFlake.getAttribute( 'cy' ) ) + ( this.svgBoundingRect.height / 120 ) );
		window.requestAnimationFrame( () => this.fall() );
	}
}

class Storm {
	constructor( container ) {
		this.container = container;
		this.svgNS = 'http://www.w3.org/2000/svg';
		this.svg = document.createElementNS( this.svgNS, 'svg' );
		this.svg.setAttribute( 'class', 'storm' );
		this.svg.style.position = 'absolute';
		this.svg.style.width = '100%';
		this.svg.style.height = '100%';
		this.svg.style.top = 0;
		this.svg.style.left = 0;
		this.container.appendChild( this.svg );
		this.rainAnimationFrameId = null;
		this.snowAnimationFrameId = null;
		this.lightningAnimationFrameId = null;
		return this;
	}

	stop() {
		if ( ! this.rainAnimationFrameId && ! this.lightningAnimationFrameId && ! this.snowAnimationFrameId ) {
			return this;
		}
		window.cancelAnimationFrame( this.rainAnimationFrameId );
		window.cancelAnimationFrame( this.snowAnimationFrameId );
		window.cancelAnimationFrame( this.lightningAnimationFrameId );
		this.rainAnimationFrameId = null;
		this.snowAnimationFrameId = null;
		this.lightningAnimationFrameId = null;
		window.requestAnimationFrame( () => this.stop() );
		return this;
	}

	rain( timer = 0 ) {
		if ( timer > ( Math.floor( Math.random() * Math.floor( 3 ) ) + 0 ) ) {
			new RainDrop( this.svg ).fall();
			this.rain();
		} else {
			this.rainAnimationFrameId = window.requestAnimationFrame( () => this.rain( ++timer ) );
		}
		return this;
	}

	snow( timer = 0 ) {
		if ( timer > ( Math.floor( Math.random() * Math.floor( 3 ) ) + 0 ) ) {
			new SnowFlake( this.svg ).fall();
			this.snow();
		} else {
			this.snowAnimationFrameId = window.requestAnimationFrame( () => this.snow( ++timer ) );
		}
		return this;
	}

	lightning( timer = 0 ) {
		if ( timer > ( Math.floor( Math.random() * Math.floor( 1000 ) ) + 300 ) ) {
			this.svg.classList.add( 'flash' );
			window.setTimeout( () => {
				this.svg.classList.remove( 'flash' );
			}, 100 );
			this.lightning();
		} else {
			this.lightningAnimationFrameId = window.requestAnimationFrame( () => this.lightning( ++timer ) );
		}
		return this;
	}
}


const init = () => {
	const storms = [];
	[].forEach.call( document.getElementsByClassName( 'rain-storm' ), container => {
		storms.push( new Storm( container ) );
	} );
	[].forEach.call( document.getElementsByClassName( 'code-404' ), code404 => {
		code404.addEventListener( 'click', event => {
			event.preventDefault();
			storms.forEach( storm => {
				if ( storm.rainAnimationFrameId || storm.snowAnimationFrameId || storm.lightningAnimationFrameId ) {
					storm.stop();
				} else {
					storm
					.rain().rain().rain().rain()
					.rain().rain().rain().rain()
					.lightning().lightning().lightning().lightning();
				}
			} );
		} );
	} );
};

if ( 'complete' === document.readyState || 'interactive' === document.readyState ) {
	init();
} else if ( document.addEventListener ) {
	document.addEventListener( 'DOMContentLoaded', init ); 
}
}
