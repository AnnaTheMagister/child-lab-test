<?php
/**
 * Article CPT Registration
 *
 * Article CPT with 4 reading modes. Taxonomies (article_author, methodology_tag)
 * are registered in register-taxonomies.php. ACF fields are in field-groups/.
 *
 * @package childlab
 */

add_action( 'init', function () {
	$labels = array(
		'name'                  => 'Статьи',
		'singular_name'         => 'Статья',
		'menu_name'             => 'Статьи',
		'all_items'             => 'Все статьи',
		'edit_item'             => 'Изменить статью',
		'view_item'             => 'Посмотреть статью',
		'view_items'            => 'Посмотреть статьи',
		'add_new_item'          => 'Добавить новую статью',
		'add_new'               => 'Добавить новую',
		'new_item'              => 'Новая статья',
		'parent_item_colon'     => 'Родительская статья:',
		'search_items'          => 'Поиск статей',
		'not_found'             => 'Не найдено статей',
		'not_found_in_trash'    => 'В корзине не найдено статей',
		'archives'              => 'Архивы статей',
		'attributes'            => 'Атрибуты статьи',
		'insert_into_item'      => 'Вставить в статью',
		'uploaded_to_this_item' => 'Загружено в эту статью',
		'filter_items_list'     => 'Фильтровать список статей',
		'filter_by_date'        => 'Фильтр статей по дате',
		'items_list_navigation' => 'Статьи навигация по списку',
		'items_list'            => 'Список статей',
		'item_published'        => 'Статья опубликована.',
		'item_published_privately' => 'Статья опубликована приватно.',
		'item_reverted_to_draft'   => 'Статья преобразована в черновик.',
		'item_scheduled'           => 'Статья запланирована.',
		'item_updated'             => 'Статья обновлена.',
		'item_link'                => 'Ссылка на статью',
		'item_link_description'    => 'Ссылка на статью.',
	);

	register_post_type( 'article', array(
		'labels'          => $labels,
		'description'     => 'Статьи в 4 режимах просмотра',
		'public'          => true,
		'show_in_rest'    => true,
		'menu_icon'       => 'dashicons-admin-post',
		'supports'        => array( 'title', 'excerpt', 'revisions', 'thumbnail', 'custom-fields' ),
		'delete_with_user' => false,
		'rest_base'       => 'articles',
	) );
} );
