<?php
/**
 * Projects CPT Registration
 *
 * @package childlab
 */

add_action( 'init', function () {
	$labels = array(
		'name'                  => 'Проекты',
		'singular_name'         => 'Проект',
		'menu_name'             => 'Проекты',
		'all_items'             => 'Все Проекты',
		'edit_item'             => 'Изменить Проект',
		'view_item'             => 'Посмотреть Проект',
		'view_items'            => 'Посмотреть Проекты',
		'add_new_item'          => 'Добавить новое Проект',
		'add_new'               => 'Добавить новое Проект',
		'new_item'              => 'Новый Проект',
		'parent_item_colon'     => 'Родитель Проект:',
		'search_items'          => 'Поиск Проекты',
		'not_found'             => 'Не найдено проекты',
		'not_found_in_trash'    => 'В корзине не найдено проекты',
		'archives'              => 'Архивы Проект',
		'attributes'            => 'Атрибуты Проект',
		'insert_into_item'      => 'Вставить в проект',
		'uploaded_to_this_item' => 'Загружено в это проект',
		'filter_items_list'     => 'Фильтровать список проекты',
		'filter_by_date'        => 'Фильтр проекты по дате',
		'items_list_navigation' => 'Проекты навигация по списку',
		'items_list'            => 'Проекты список',
		'item_published'        => 'Проект опубликовано.',
		'item_published_privately' => 'Проект опубликована приватно.',
		'item_reverted_to_draft'   => 'Проект преобразован в черновик.',
		'item_scheduled'           => 'Проект запланировано.',
		'item_updated'             => 'Проект обновлён.',
		'item_link'                => 'Cсылка на Проект',
		'item_link_description'    => 'Ссылка на проект.',
	);

	register_post_type( 'projects', array(
		'labels'          => $labels,
		'description'     => 'Исследовательские и образовательные проекты',
		'public'          => true,
		'show_in_rest'    => true,
		'menu_icon'       => 'dashicons-admin-post',
		'supports'        => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'post-formats' ),
		'delete_with_user' => false,
		'rest_base'       => 'projects',
	) );
} );
