<?php
/**
 * Taxonomy Registrations (article_author, methodology_tag)
 *
 * @package childlab
 */

add_action( 'init', function () {
	// --- article_author taxonomy ---
	$author_labels = array(
		'name'                       => 'Авторы статей',
		'singular_name'              => 'Автор статьи',
		'menu_name'                  => 'Авторы статей',
		'all_items'                  => 'Все Авторы статей',
		'edit_item'                  => 'Изменить Автор статьи',
		'view_item'                  => 'Посмотреть Автор статьи',
		'update_item'                => 'Обновить Автор статьи',
		'add_new_item'               => 'Добавить новое Автор статьи',
		'new_item_name'              => 'Новое Автор статьи название',
		'search_items'               => 'Поиск Авторы статей',
		'popular_items'              => 'Популярные Авторы статей',
		'separate_items_with_commas'  => 'Разделять авторы статей запятыми',
		'add_or_remove_items'        => 'Добавить или удалить авторы статей',
		'choose_from_most_used'      => 'Выберите из наиболее часто используемых авторы статей',
		'not_found'                  => 'Не найдено авторы статей',
		'no_terms'                   => 'Нет авторы статей',
		'items_list_navigation'      => 'Авторы статей навигация по списку',
		'items_list'                 => 'Авторы статей список',
		'back_to_items'              => '← Перейти к авторы статей',
		'item_link'                  => 'Cсылка на Автор статьи',
		'item_link_description'      => 'Ссылка на автор статьи',
	);

	register_taxonomy( 'article_author', array( 'article' ), array(
		'labels'            => $author_labels,
		'description'       => 'Авторы статей могут быть выбраны в качестве авторов, также они будут отображаться в секции "Команда"',
		'public'            => true,
		'show_in_menu'      => true,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'rest_base'         => 'article-authors',
	) );

	// --- methodology_tag taxonomy ---
	$tag_labels = array(
		'name'                       => 'Разделы методологии',
		'singular_name'              => 'Раздел методологии',
		'menu_name'                  => 'Разделы методологии',
		'all_items'                  => 'Все Разделы методологии',
		'edit_item'                  => 'Изменить Раздел методологии',
		'view_item'                  => 'Посмотреть Раздел методологии',
		'update_item'                => 'Обновить Раздел методологии',
		'add_new_item'               => 'Добавить новое Раздел методологии',
		'new_item_name'              => 'Новое Раздел методологии название',
		'search_items'               => 'Поиск Разделы методологии',
		'popular_items'              => 'Популярные Разделы методологии',
		'separate_items_with_commas'  => 'Разделять разделы методологии запятыми',
		'add_or_remove_items'        => 'Добавить или удалить разделы методологии',
		'choose_from_most_used'      => 'Выберите из наиболее часто используемых разделы методологии',
		'not_found'                  => 'Не найдено разделы методологии',
		'no_terms'                   => 'Нет разделы методологии',
		'items_list_navigation'      => 'Разделы методологии навигация по списку',
		'items_list'                 => 'Разделы методологии список',
		'back_to_items'              => '← Перейти к разделы методологии',
		'item_link'                  => 'Cсылка на Раздел методологии',
		'item_link_description'      => 'Ссылка на раздел методологии',
	);

	register_taxonomy( 'methodology_tag', array( 'article' ), array(
		'labels'            => $tag_labels,
		'public'            => true,
		'show_in_menu'      => true,
		'show_in_rest'      => true,
		'rest_base'         => 'methodology-tags',
		'sort'              => true,
		'meta_box_cb'       => 'post_categories_meta_box',
	) );
} );
