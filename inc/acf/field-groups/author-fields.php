<?php
/**
 * Article Author (Taxonomy) ACF Field Group
 *
 * Fields for the article_author taxonomy: name, photo, bio, info.
 *
 * @package childlab
 */

/**
 * Get author field group definition.
 *
 * @return array
 */
function childlab_get_author_field_group() {
	return array(
		'key'    => 'group_695db8d315240',
		'title'  => 'Автор статьи поля',
		'fields' => array(
			array(
				'key'               => 'field_695db8d47402f',
				'label'             => 'Фамилия',
				'name'              => 'last_name',
				'aria-label'        => '',
				'type'              => 'text',
				'instructions'      => '',
				'required'          => 1,
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
				'key'               => 'field_695db90374030',
				'label'             => 'Имя',
				'name'              => 'first_name',
				'aria-label'        => '',
				'type'              => 'text',
				'instructions'      => '',
				'required'          => 1,
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
				'key'               => 'field_695db93874031',
				'label'             => 'Фото',
				'name'              => 'photo',
				'aria-label'        => '',
				'type'              => 'image',
				'instructions'      => '',
				'required'          => 0,
				'conditional_logic' => 0,
				'wrapper'           => array(
					'width' => '',
					'class' => '',
					'id'    => '',
				),
				'return_format'    => 'url',
				'library'          => 'all',
				'min_width'        => '',
				'min_height'       => '',
				'min_size'         => '',
				'max_width'        => '',
				'max_height'       => '',
				'max_size'         => '',
				'mime_types'       => '',
				'allow_in_bindings' => 0,
				'preview_size'     => 'medium',
				'show_in_graphql'  => 1,
				'show_in_rest'     => 1,
			),
			array(
				'key'               => 'field_695db97974032',
				'label'             => 'Главная информация',
				'name'              => 'bio',
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
				'key'               => 'field_695db9d474033',
				'label'             => 'Описание',
				'name'              => 'info',
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
		),
		'location' => array(
			array(
				array(
					'param'    => 'taxonomy',
					'operator' => '==',
					'value'    => 'article_author',
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
	acf_add_local_field_group( childlab_get_author_field_group() );
}

// Hook-based registration.
add_action( 'acf/include_fields', function () {
	if ( function_exists( 'acf_add_local_field_group' ) ) {
		acf_add_local_field_group( childlab_get_author_field_group() );
	}
} );
