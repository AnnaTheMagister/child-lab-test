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
	);

	register_taxonomy('course_type', 'courses', $args);
}
add_action('init', 'register_course_type_taxonomy');

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

function add_default_course_type_terms()
{
	if (!term_exists('online', 'course_type')) {
		wp_insert_term('Онлайн-курс', 'course_type', array('slug' => 'online', 'description' => '#0073aa'));
	}
	if (!term_exists('offline', 'course_type')) {
		wp_insert_term('Очный курс', 'course_type', array('slug' => 'offline', 'description' => '#00a0d2'));
	}
}
add_action('init', 'add_default_course_type_terms');

// Функция для расчета светлого цвета (lighten by 76%)
function calculate_lightened_color($hex_color, $percentage = 76)
{
	// Convert hex to RGB
	$hex = str_replace('#', '', $hex_color);
	$rgb = array();

	for ($i = 0; $i < 3; $i++) {
		$rgb[$i] = hexdec(substr($hex, $i * 2, 2));
	}

	// Calculate new color values
	$new_rgb = array();
	for ($i = 0; $i < 3; $i++) {
		$lightened = min(255, $rgb[$i] + round((255 - $rgb[$i]) * $percentage / 100));
		$new_rgb[$i] = $lightened;
	}

	// Convert back to hex
	return sprintf('#%02x%02x%02x', $new_rgb[0], $new_rgb[1], $new_rgb[2]);
}

// Функция для получения значения поля с расчетом по умолчанию
function get_course_background_color($post_id = null)
{
	if (!$post_id) {
		$post_id = get_the_ID();
	}

	// Получаем значение цвета фона из ACF, если оно задано
	$background_color = get_field('course_background_color', $post_id);

	// Если цвет фона не задан, но задан основной цвет курса, рассчитываем его
	if (empty($background_color)) {
		$course_color = get_field('course_color', $post_id);
		if (!empty($course_color)) {
			$background_color = calculate_lightened_color($course_color, 76);
		}
	}

	return $background_color ? $background_color : '#F3C5D9'; // По умолчанию светлый цвет, если не задано ничего
}

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
				'default_value' => array(
				),
				'layout' => 'vertical',
				'toggle' => 0,
				'return_format' => 'value',
			),
			array(
				'key' => 'field_course_type',
				'label' => 'Тип курса',
				'name' => 'course_type',
				'type' => 'checkbox',
				'instructions' => 'Выберите тип курса',
				'required' => 0,
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
				'allow_custom' => 0,
				'default_value' => array(
				),
				'layout' => 'vertical',
				'toggle' => 0,
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
				'instructions' => 'Основной цвет курса (по умолчанию #EB3F9B)',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
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
				'instructions' => 'Цвет фона (по умолчанию рассчитывается как lighten by 76% от основного цвета)',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
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