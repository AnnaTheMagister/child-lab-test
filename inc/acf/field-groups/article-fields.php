<?php

// Article fields group
acf_add_local_field_group(array(
	'key' => 'group_6951f1ee5ebf0',
	'title' => 'Article fields',
	'fields' => array(
		array(
			'key' => 'field_695ab01b6404c',
			'label' => 'Подзаголовок',
			'name' => 'subtitle',
			'aria-label' => '',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'maxlength' => '',
			'allow_in_bindings' => 0,
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
			'show_in_graphql' => 1, // Добавлено для AJAX/REST API
			'show_in_rest' => 1,    // Добавлено для REST API
		),
		array(
			'key' => 'field_6951f81054002',
			'label' => 'Для педагогов (длинно)',
			'name' => 'for_scientist_long',
			'aria-label' => '',
			'type' => 'wysiwyg',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'tabs' => 'all',
			'toolbar' => 'full',
			'media_upload' => 1,
			'allow_in_bindings' => 0,
			'show_in_graphql' => 1,
			'show_in_rest' => 1,
		),
		// ... (remaining fields would continue here)
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'article',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
));

?>