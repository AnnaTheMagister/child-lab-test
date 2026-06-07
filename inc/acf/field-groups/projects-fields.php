<?php
/**
 * Projects ACF Field Group
 *
 * Fields for the projects CPT.
 *
 * @package childlab
 */

/**
 * Get projects field group definition.
 *
 * @return array
 */
function childlab_get_projects_field_group() {
	return array(
		'key'    => 'group_6963e16735f95',
		'title'  => 'Проект поля',
		'fields' => array(
			array(
				'key'               => 'field_6963e169b70e1',
				'label'             => 'Краткое описание',
				'name'              => 'project_description',
				'aria-label'        => '',
				'type'              => 'wysiwyg',
				'instructions'      => '',
				'required'          => 1,
				'conditional_logic' => 0,
				'wrapper'           => array(
					'width' => '',
					'class' => '',
					'id'    => '',
				),
				'default_value'      => '',
				'allow_in_bindings'  => 0,
				'tabs'               => 'all',
				'toolbar'            => 'full',
				'media_upload'       => 1,
				'delay'              => 0,
				'show_in_graphql'    => 1,
				'show_in_rest'       => 1,
			),
		),
		'location' => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'projects',
				),
			),
		),
		'menu_order'            => 0,
		'position'              => 'normal',
		'style'                 => 'default',
		'label_placement'       => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen'        => '',
		'active'                => true,
		'description'           => '',
		'show_in_rest'          => 1,
		'display_title'         => '',
	);
}

// Direct registration.
if ( function_exists( 'acf_add_local_field_group' ) ) {
	acf_add_local_field_group( childlab_get_projects_field_group() );
}

// Hook-based registration.
add_action( 'acf/include_fields', function () {
	if ( function_exists( 'acf_add_local_field_group' ) ) {
		acf_add_local_field_group( childlab_get_projects_field_group() );
	}
} );
