<?php
/**
 * Methodology Tag Term Sorting
 *
 * Automatically sorts methodology_tag terms by their ACF 'order' field
 * in admin and frontend contexts.
 *
 * @package childlab
 */

add_action( 'pre_get_terms', function ( $query ) {
	// Skip in admin unless AJAX.
	if ( is_admin() && ! wp_doing_ajax() ) {
		return;
	}

	$taxonomy = $query->query_vars['taxonomy'] ?? '';
	$is_methodology_tag = (
		( is_array( $taxonomy ) && in_array( 'methodology_tag', $taxonomy, true ) )
		|| $taxonomy === 'methodology_tag'
	);

	if ( $is_methodology_tag ) {
		$query->query_vars['meta_key'] = 'order';
		$query->query_vars['orderby']  = 'meta_value_num';
		$query->query_vars['order']    = 'ASC';
	}
} );
