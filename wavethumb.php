<?php
/**
 * WaveThumb
 *
 * @package   WaveThumb
 * @copyright Copyright (c) 2017, Cedaro, LLC
 * @license   GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name: WaveThumb
 * Plugin URI:  https://github.com/cedaro/wavethumb
 * Description: An experimental plugin demonstrating how to generate and save waveforms for audio attachments using the WordPress REST API.
 * Version:     1.0.0
 * Author:      Cedaro
 * Author URI:  https://www.cedaro.com/
 * License:     GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wavethumb
 * Domain Path: /languages
 */

/**
 * Register a REST field for the waveform attachment.
 */
add_action( 'rest_api_init', function() {
	register_rest_field( 'attachment', 'waveform', array(
		'get_callback' => function( $post ) {
			return get_post_meta( $post['id'], '_waveform_id', true );
		},
		'update_callback' => function( $value, $post ) {
			update_post_meta( $post->ID, '_waveform_id', $value );
		},
		'schema' => array(
			'description' => esc_html__( 'The id of the waveform for the audio file.', 'wavethumb' ),
			'type'        => 'integer',
			'context'     => array( 'view', 'edit', 'embed' ),
		),
	) );
} );

/**
 * Enqueue admin assets.
 */
add_action( 'admin_enqueue_scripts', function() {
	if ( 'attachment' !== get_current_screen()->id || 'audio/mpeg' !== get_post_mime_type() ) {
		return;
	}

	wp_enqueue_style(
		'wavethumb-edit-attachment',
		plugins_url( '/admin/assets/css/admin.css', __FILE__ )
	);

	wp_enqueue_script(
		'wavethumb-edit-attachment',
		plugins_url( 'admin/assets/js/edit-attachment.bundle.js', __FILE__ ),
		array( 'wp-api-request' ),
		'1.0.0',
		true
	);

	$attachment_id = get_post()->ID;

	$file = get_attached_file( $attachment_id );
	$waveform_filename = str_replace( '.', '-', basename( $file ) ) . '-waveform.png';
	$waveform_filename = apply_filters( 'wavethumb_filename', $waveform_filename, $attachment_id );

	$waveform_id  = get_post_meta( $attachment_id, '_waveform_id', true );
	$waveform_url = '';

	if ( $waveform_id ) {
		$waveform_url = wp_get_attachment_image_url( $waveform_id, 'full' );
	}

	wp_localize_script( 'wavethumb-edit-attachment', '_waveThumbSettings', array(
		'attachmentId'     => $attachment_id,
		'attachmentUrl'    => esc_url_raw( wp_get_attachment_url( $attachment_id ) ),
		'waveformColor'    => apply_filters( 'wavethumb_color', 'black' ),
		'waveformFilename' => $waveform_filename,
		'waveformUrl'      => esc_url_raw( $waveform_url ),
	) );
} );
