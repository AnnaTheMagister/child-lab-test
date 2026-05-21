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
		'show_in_rest' => true,
		'public' => true,
		'publicly_queryable' => true,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_admin_bar' => true,
		'show_in_nav_menus' => true,
		'query_var' => true,
		'rewrite' => array('slug' => 'courses'), // URL: /courses/название-курса/
		'capability_type' => 'post',
		'has_archive' => true, // Страница архива: /courses/
		'hierarchical' => false,
		'menu_position' => 5,
		'menu_icon' => 'dashicons-welcome-learn-more',
		'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'post-formats'),
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
	);

	register_taxonomy('course_audience', 'courses', $args);
}
add_action('init', 'register_course_audience_taxonomy');

function add_default_course_audience_terms()
{
	if (!term_exists('parents', 'course_audience')) {
		wp_insert_term('Родителям', 'course_audience', array('slug' => 'parents'));
	}
	if (!term_exists('teachers', 'course_audience')) {
		wp_insert_term('Педагогам', 'course_audience', array('slug' => 'teachers'));
	}
}
add_action('init', 'add_default_course_audience_terms');

// 3. Добавляем ACF поля для курсов
if (function_exists('acf_add_local_field_group')):

acf_add_local_field_group(array(
	'key' => 'group_course_fields',
	'title' => 'Поля курса',
	'fields' => array(
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
			'default_value' => array(
			),
			'layout' => 'vertical',
			'toggle' => 0,
			'return_format' => 'value',
		),
		array(
			'key' => 'field_course_duration',
			'label' => 'Длительность курса',
			'name' => 'course_duration',
			'type' => 'text',
			'instructions' => 'Укажите продолжительность курса (например: 4 недели)',
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
			'key' => 'field_course_level',
			'label' => 'Уровень сложности',
			'name' => 'course_level',
			'type' => 'select',
			'instructions' => 'Выберите уровень сложности курса',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'choices' => array(
				'beginner' => 'Начальный',
				'intermediate' => 'Средний',
				'advanced' => 'Продвинутый',
			),
			'default_value' => false,
			'allow_null' => 1,
			'multiple' => 0,
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

endif;

?>