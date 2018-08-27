export default class Waveform {
	constructor({ buffer, color = 'black', length = 1800 }) {
		this.buffer = buffer;
		this.color = color;
		this.length = length;
	}

	draw({ el, peakSpacing = 1 }) {
		const canvas = 'string' === typeof el ? document.querySelector( el ) : el;
		const context = canvas.getContext( '2d' );
		const height = canvas.height / 2;
		const length = Math.ceil( this.length / peakSpacing );
		const peaks = this.getPeaks( length, this.buffer );
		const peaksLength = peaks.length;
		const y = value => height - Math.round( value * height );

		canvas.width = this.length;

		context.beginPath();
		context.moveTo( 0, height );

		// Draw the upper path.
		for ( let i = 0; i < peaksLength; i++ ) {
			context.lineTo( i * peakSpacing, y( peaks[ i ].max ) );
		}

		context.lineTo( this.length - 1, 0 );

		// Draw the lower path.
		for ( let i = peaksLength - 1; i >= 0; i-- ) {
			context.lineTo( i * peakSpacing, y( peaks[ i ].min ) );
		}

		context.lineTo( 0, 0 );
		context.fillStyle = this.color;
		context.fill();

		return this;
	}

	getPeaks( length, buffer ) {
		const sampleSize = Math.floor( buffer.length / length );
		const numberOfChannels = buffer.numberOfChannels;
		const peaks = Array( length );

		for ( let channelIndex = 0; channelIndex < numberOfChannels; channelIndex++ ) {
			const channelData = buffer.getChannelData( channelIndex );

			for ( let i = 0; i < length; i++ ) {
				const start = parseInt( sampleSize * i, 10 );

				const sample = channelData.slice( start, start + sampleSize );
				const max = sample.reduce( ( a, b ) => a > b ? a : b, 0 );
				const min = sample.reduce( ( a, b ) => a < b ? a : b, 0 );

				peaks[ i ] = peaks[ i ] || { max: 0, min: 0 };

				if ( max > peaks[ i ].max ) {
					peaks[ i ].max = max;
				}

				if ( min < peaks[ i ].min ) {
					peaks[ i ].min = min;
				}
			}
		}

		return peaks;
	}
}
