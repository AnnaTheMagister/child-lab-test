<?php
/**
 * Methodology Tag (Taxonomy) ACF Field Group
 *
 * Fields for the methodology_tag taxonomy: color, image, order.
 *
 * @package childlab
 */

/**
 * Get methodology tag field group definition.
 *
 * @return array
 */
function childlab_get_methodology_tag_field_group() {
	return array(
		'key'    => 'group_69584e787f669',
		'title'  => 'Раздел методологии поля',
		'fields' => array(
			array(
				'key'               => 'field_69584e7b607bb',
				'label'             => 'Цвет',
				'name'              => 'color',
				'aria-label'        => '',
				'type'              => 'color_picker',
				'instructions'      => '',
				'required'          => 0,
				'conditional_logic' => 0,
				'wrapper'           => array(
					'width' => '',
					'class' => '',
					'id'    => '',
				),
				'default_value'       => '#FF0000',
				'enable_opacity'      => 1,
				'return_format'       => 'string',
				'allow_in_bindings'   => 0,
				'show_custom_palette' => 0,
				'show_color_wheel'    => 1,
				'custom_palette_source' => '',
				'palette_colors'      => '',
				'show_in_graphql'     => 1,
				'show_in_rest'        => 1,
			),
			array(
				'key'               => 'field_methodology_tag_image',
				'label'             => 'Изображение раздела',
				'name'              => 'tag_image',
				'type'              => 'image',
				'instructions'      => 'Загрузите изображение для раздела методологии',
				'required'          => 0,
				'conditional_logic' => 0,
				'wrapper'           => array(
					'width' => '',
					'class' => '',
					'id'    => '',
				),
				'return_format'     => 'url',
				'library'           => 'all',
				'min_width'         => '',
				'min_height'        => '',
				'min_size'          => '',
				'max_width'         => '',
				'max_height'        => '',
				'max_size'          => '',
				'mime_types'        => 'jpg, jpeg, png, gif, webp, svg',
				'allow_in_bindings' => 0,
				'preview_size'      => 'medium',
				'show_in_graphql'   => 1,
				'show_in_rest'      => 1,
			),
			array(
				'key'               => 'field_methodology_tag_order',
				'label'             => 'Порядок отображения',
				'name'              => 'order',
				'type'              => 'number',
				'instructions'      => 'Число, определяющее порядок отображения раздела на странице. Разделы сортируются по возрастанию значения (от меньшего к большему). Если у нескольких разделов одинаковое значение, сортировка происходит по алфавиту.',
				'required'          => 0,
				'conditional_logic' => 0,
				'wrapper'           => array(
					'width' => '50',
					'class' => 'order-field',
					'id'    => 'methodology-order',
				),
				'default_value'     => 0,
				'min'               => 0,
				'max'               => 999,
				'step'              => 1,
				'placeholder'       => '0',
				'prepend'           => 'Позиция:',
				'append'            => '',
				'show_in_graphql'   => 1,
				'show_in_rest'      => 1,
			),
		),
		'location' => array(
			array(
				array(
					'param'    => 'taxonomy',
					'operator' => '==',
					'value'    => 'methodology_tag',
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
	acf_add_local_field_group( childlab_get_methodology_tag_field_group() );
}

// Hook-based registration.
add_action( 'acf/include_fields', function () {
	if ( function_exists( 'acf_add_local_field_group' ) ) {
		acf_add_local_field_group( childlab_get_methodology_tag_field_group() );
	}
} );
