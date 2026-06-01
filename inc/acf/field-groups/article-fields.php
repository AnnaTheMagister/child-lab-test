<?php
/**
 * Article ACF Field Group
 *
 * Reading mode content variants (4 modes) plus subtitle.
 * Registered via both direct call and acf/include_fields hook for reliability.
 *
 * @package childlab
 */

/**
 * Get article field group definition.
 *
 * @return array
 */
function childlab_get_article_field_group() {
	return array(
		'key'    => 'group_6951f1ee5ebf0',
		'title'  => 'Article fields',
		'fields' => array(
			array(
				'key'               => 'field_695ab01b6404c',
				'label'             => 'Подзаголовок',
				'name'              => 'subtitle',
				'aria-label'        => '',
				'type'              => 'text',
				'instructions'      => '',
				'required'          => 0,
				'conditional_logic' => 0,
				'wrapper'           => array(
					'width' => '',
					'class' => '',
					'id'    => '',
				),
				'default_value'     => '',
				'maxlength'         => '',
				'allow_in_bindings' => 0,
				'placeholder'       => '',
				'prepend'           => '',
				'append'            => '',
				'show_in_graphql'   => 1,
				'show_in_rest'      => 1,
			),
			array(
				'key'               => 'field_6951f81054002',
				'label'             => 'Для педагогов (длинно)',
				'name'              => 'for_scientist_long',
				'aria-label'        => '',
				'type'              => 'wysiwyg',
				'instructions'      => '',
				'required'          => 0,
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
			array(
				'key'               => 'field_6952c71b217e9',
				'label'             => 'Для педагогов (кратко)',
				'name'              => 'for_scientist_short',
				'aria-label'        => '',
				'type'              => 'wysiwyg',
				'instructions'      => '',
				'required'          => 0,
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
			array(
				'key'               => 'field_6951f80554001',
				'label'             => 'Для родителей (длинно)',
				'name'              => 'for_parent_long',
				'aria-label'        => '',
				'type'              => 'wysiwyg',
				'instructions'      => '',
				'required'          => 0,
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
			array(
				'key'               => 'field_6951f1ee0de17',
				'label'             => 'Для родителей (кратко)',
				'name'              => 'for_parent_short',
				'aria-label'        => '',
				'type'              => 'wysiwyg',
				'instructions'      => '',
				'required'          => 0,
				'conditional_logic' => 0,
				'wrapper'           => array(
					'width' => '',
					'class' => '',
					'id'    => '',
				),
				'default_value'      => '',
				'allow_in_bindings'  => 1,
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
					'value'    => 'article',
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

// Direct registration (fires immediately when ACF is active).
if ( function_exists( 'acf_add_local_field_group' ) ) {
	acf_add_local_field_group( childlab_get_article_field_group() );
}

// Hook-based registration (fires when ACF is ready).
add_action( 'acf/include_fields', function () {
	if ( function_exists( 'acf_add_local_field_group' ) ) {
		acf_add_local_field_group( childlab_get_article_field_group() );
	}
} );
