export default class EditAttachmentScreen {
	constructor({ buttonText = 'Generate Waveform', fieldLabel = 'Waveform' } = {}) {
		const markup = `
			<p>
				<strong>${fieldLabel}</strong><br>
				<img class="hidden">
				<button type="button" class="button hidden">${buttonText}</button>
				<span class="spinner"></span>
			</p>
			<div class="wavethumb-canvas-container">
				<canvas class="wavethumb-canvas" width="1800" height="280"></canvas>
			</div>`;

		this.el = document.createElement( 'div' );
		this.el.classList.add( 'wavethumb-preview' );
		this.el.innerHTML = markup;

		const attachment = document.querySelector( '.wp_attachment_holder' );
		attachment.parentNode.insertBefore( this.el, attachment.nextElementSibling );

		this.button = this.el.querySelector( 'button' );
		this.canvas = this.el.querySelector( 'canvas' );
		this.preview = this.el.querySelector( 'img' );
		this.spinner = this.el.querySelector( '.spinner' );
	}

	processing() {
		this.button.setAttribute( 'disabled', true );
		this.spinner.classList.add( 'is-active' );
	}

	setWaveformUrl( url ) {
		this.button.classList.add( 'hidden' );
		this.spinner.classList.remove( 'is-active' );
		this.preview.src = url;
		this.preview.classList.remove( 'hidden' );
	}

	showButton() {
		this.button.classList.remove( 'hidden' );
	}
}
