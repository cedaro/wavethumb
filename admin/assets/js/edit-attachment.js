import EditAttachmentScreen from './modules/edit-attachment-screen';
import Waveform from './modules/waveform';
import wp from 'wp';

const audioContext = new ( window.AudioContext || window.webkitAudioContext )();
const screen = new EditAttachmentScreen();
const settings = _waveThumbSettings;

function loadAudio( url ) {
	return new Promise( ( resolve, reject ) => {
		const request = new XMLHttpRequest();
		request.open( 'GET', url, true );
		request.responseType = 'arraybuffer';

		request.onload = () => {
			audioContext.decodeAudioData(
				request.response,
				buffer => {
					resolve( buffer );
				},
				e => reject( e )
			);
		}
		request.send();
	});
}

function generateWaveform({ audioId, audioUrl, color, filename, screen }) {
	return loadAudio( audioUrl )
		.then( buffer => {
			const waveform = new Waveform({
				buffer: buffer,
				color: color
			});

			waveform.draw({
				el: screen.canvas
			});

			return new Promise( ( resolve, reject ) => {
				screen.canvas.toBlob( resolve );
			});
		})
		.then( blob => {
			return wp.apiRequest({
				path: '/wp/v2/media',
				method: 'POST',
				contentType: 'image/png',
				data: blob,
				headers: {
					'Content-Disposition': `attachment; filename="${filename}"`
				},
				processData: false
			});
		})
		.then( response => {
			screen.setWaveformUrl( response.source_url );

			return wp.apiRequest({
				path: `/wp/v2/media/${audioId}`,
				method: 'PATCH',
				data: {
					waveform: response.id
				}
			});
		});
}

if ( '' !== settings.waveformUrl ) {
	screen.setWaveformUrl( settings.waveformUrl );
} else {
	screen.showButton();
}

screen.button.addEventListener( 'click', e => {
	screen.processing();

	generateWaveform({
		audioId: settings.attachmentId,
		audioUrl: settings.attachmentUrl,
		color: settings.waveformColor,
		filename: settings.waveformFilename,
		screen: screen
	});
});
