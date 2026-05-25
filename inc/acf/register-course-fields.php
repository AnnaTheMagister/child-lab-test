<?php

// 1. Регистрация типа записи "Курсы"
function register_course_post_type()
{
	$labels = array(
		'name' => 'Курсы',
		'singular_name' => 'Курс',
		'menu_name' => 'Курсы',
		'add_new' => 'Добавить новый',
		'add_new_item' => 'Добавить новый курс',
		'edit_item' => 'Редактировать курс',
		'new_item' => 'Новый курс',
		'view_item' => 'Просмотреть курс',
		'search_items' => 'Искать курсы',
		'not_found' => 'Курсов не найдено',
		'not_found_in_trash' => 'В корзине нет курсов',
		'archives' => 'Архивы курсов',
		'attributes' => 'Атрибуты курса',
		'insert_into_item' => 'Вставить в курс',
		'uploaded_to_this_item' => 'Загружено в этот курс',
		'filter_items_list' => 'Фильтровать список курсов',
		'filter_by_date' => 'Фильтр курсов по дате',
		'items_list_navigation' => 'Курс навигация по списку',
		'items_list' => 'Список курсов',
		'item_published' => 'Курс опубликован.',
		'item_published_privately' => 'Курс опубликован приватно.',
		'item_reverted_to_draft' => 'Курс преобразован в черновик.',
		'item_scheduled' => 'Курс запланирован.',
		'item_updated' => 'Курс обновлён.',
		'item_link' => 'Ссылка на курс',
		'item_link_description' => 'Ссылка на курс.',
	);

	$args = array(
		'labels' => $labels,
		'public' => true,
		'show_in_rest' => true,
		'menu_icon' => 'dashicons-welcome-learn-more',
		'supports' => array(
			0 => 'title',
			1 => 'editor',
			2 => 'excerpt',
			3 => 'thumbnail',
			4 => 'custom-fields',
			5 => 'post-formats',
		),
		'delete_with_user' => false,
		'rest_base' => 'courses', // Для REST API
	);

	register_post_type('courses', $args);
}
add_action('init', 'register_course_post_type');

// 2. Добавляем таксономию для фильтрации "Родителям / Педагогам"
function register_course_audience_taxonomy()
{
	$labels = array(
		'name' => 'Аудитория курса',
		'singular_name' => 'Аудитория',
		'search_items' => 'Найти аудиторию',
		'popular_items' => 'Популярные аудитории',
		'all_items' => 'Все аудитории',
		'edit_item' => 'Редактировать',
		'update_item' => 'Обновить',
		'add_new_item' => 'Добавить новую',
		'new_item_name' => 'Название новой аудитории',
		'separate_items_with_commas' => 'Разделяйте запятыми',
		'add_or_remove_items' => 'Добавить или удалить',
		'choose_from_most_used' => 'Выбрать из часто используемых',
	);

	$args = array(
		'labels' => $labels,
		'public' => true,
		'show_in_rest' => true,
		'show_admin_column' => true,
		'hierarchical' => false,
		'rewrite' => array('slug' => 'course-audience'),
		'rest_base' => 'course-audience',
	);

	register_taxonomy('course_audience', 'courses', $args);
}
add_action('init', 'register_course_audience_taxonomy');

// 3. Добавляем таксономию для типа курса
function register_course_type_taxonomy()
{
	$labels = array(
		'name' => 'Тип курса',
		'singular_name' => 'Тип курса',
		'search_items' => 'Найти тип курса',
		'popular_items' => 'Популярные типы курсов',
		'all_items' => 'Все типы курсов',
		'edit_item' => 'Редактировать тип курса',
		'update_item' => 'Обновить тип курса',
		'add_new_item' => 'Добавить новый тип курса',
		'new_item_name' => 'Название нового типа курса',
		'separate_items_with_commas' => 'Разделяйте запятыми',
		'add_or_remove_items' => 'Добавить или удалить типы курсов',
		'choose_from_most_used' => 'Выбрать из часто используемых',
	);

	$args = array(
		'labels' => $labels,
		'public' => true,
		'show_in_rest' => true,
		'show_admin_column' => true,
		'hierarchical' => false,
		'rewrite' => array('slug' => 'course-type'),
		'rest_base' => 'course-type'
	);

	register_taxonomy('course_type', 'courses', $args);
}
add_action('init', 'register_course_type_taxonomy');

// 4. Добавляем ACF поля для курсов
if (function_exists('acf_add_local_field_group')):

	acf_add_local_field_group(array(
		'key' => 'group_course_fields',
		'title' => 'Поля курса',
		'fields' => array(
			array(
				'key' => 'field_course_subtitle',
				'label' => 'Подзаголовок курса',
				'name' => 'course_subtitle',
				'type' => 'text',
				'instructions' => 'Подзаголовок курса',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
				'placeholder' => '',
				'maxlength' => '',
				'rows' => '',
				'new_lines' => '',
			),
			array(
				'key' => 'field_course_description',
				'label' => 'Описание курса',
				'name' => 'course_description',
				'type' => 'textarea',
				'instructions' => 'Краткое описание курса для списка курсов',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
				'placeholder' => '',
				'maxlength' => '',
				'rows' => 4,
				'new_lines' => '',
			),
			array(
				'key' => 'field_course_short_description',
				'label' => 'Краткое описание курса для баннера',
				'name' => 'course_short_description',
				'type' => 'textarea',
				'instructions' => 'Краткое описание курса для отображения на баннере',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
				'placeholder' => '',
				'maxlength' => '',
				'rows' => 3,
				'new_lines' => '',
			),
			array(
				'key' => 'field_course_access_link',
				'label' => 'Ссылка на курс',
				'name' => 'course_access_link',
				'type' => 'url',
				'instructions' => 'URL для получения доступа к курсу',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
				'placeholder' => 'https://example.com/course',
			),
			array(
				'key' => 'field_course_audience',
				'label' => 'Целевая аудитория',
				'name' => 'course_audience',
				'type' => 'checkbox',
				'instructions' => 'Выберите целевую аудиторию курса',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'choices' => array(
					'parents' => 'Родителям',
					'teachers' => 'Педагогам',
				),
				'allow_custom' => 0,
				'default_value' => array(),
				'layout' => 'vertical',
				'toggle' => 0,
				'return_format' => 'value',
			),
			array(
				'key' => 'field_course_type',
				'label' => 'Тип курса',
				'name' => 'course_type',
				'type' => 'select',
				'instructions' => 'Выберите тип курса',
				'required' => 1,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'choices' => array(
					'online' => 'Онлайн-курс',
					'offline' => 'Очный курс',
				),
				'allow_null' => 0,
				'allow_custom' => 0,
				'placeholder' => '',
				'return_format' => 'value',
			),

		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'courses',
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

	// Добавляем группу полей "Палитра курса"
	acf_add_local_field_group(array(
		'key' => 'group_course_palette',
		'title' => 'Палитра курса',
		'fields' => array(
			array(
				'key' => 'field_course_color',
				'label' => 'Цвет курса',
				'name' => 'course_color',
				'type' => 'color_picker',
				'instructions' => 'Основной цвет курса',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '25',
					'class' => '',
					'id' => '',
				),
				'default_value' => '#EB3F9B',
			),
			array(
				'key' => 'field_course_background_color',
				'label' => 'Цвет фона',
				'name' => 'course_background_color',
				'type' => 'color_picker',
				'instructions' => 'Цвет фона',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '25',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
			),
			array(
				'key' => 'field_course_title_color',
				'label' => 'Цвет заголовка',
				'name' => 'course_title_color',
				'type' => 'color_picker',
				'instructions' => 'Цвет заголовка курса',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '25',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
			),
			array(
				'key' => 'field_course_button_gradient',
				'label' => 'Переход градиента кнопки',
				'name' => 'course_button_gradient',
				'type' => 'color_picker',
				'instructions' => 'Цвет градиента кнопки (для перехода)',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '25',
					'class' => '',
					'id' => '',
				),
				'default_value' => '',
			),
		),
		'location' => array(
			array(
				array(
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'courses',
				),
			),
		),
		'menu_order' => 1,
		'position' => 'normal',
		'style' => 'default',
		'label_placement' => 'top',
		'instruction_placement' => 'label',
		'hide_on_screen' => '',
		'active' => true,
		'description' => '',
	));

endif;

?>