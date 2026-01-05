<?php


/**
 * Получает похожие статьи по тегам
 * 
 * @param int $post_id ID текущей статьи
 * @param int $limit Количество статей для вывода (по умолчанию 3)
 * @param array $exclude_ids ID статей для исключения
 * @param string $orderby Параметр сортировки
 * @param string $order Направление сортировки
 * @return array|WP_Query Массив объектов статей или WP_Query объект
 */
function get_related_articles($post_id = null, $limit = 3, $exclude_ids = [], $orderby = 'date', $order = 'DESC')
{

    // Если ID не указан, берем текущую статью
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    // Получаем теги текущей статьи
    $tags = wp_get_post_terms($post_id, 'methodology_tag', array('fields' => 'ids'));

    // Если нет тегов, возвращаем пустой массив
    if (empty($tags) || is_wp_error($tags)) {
        return [];
    }

    // Подготавливаем ID для исключения
    $exclude = array_merge([$post_id], $exclude_ids);

    // Аргументы для запроса
    $args = [
        'post_type' => 'article',
        'posts_per_page' => $limit,
        'post__not_in' => $exclude,
        'orderby' => $orderby,
        'order' => $order,
        'tax_query' => [
            [
                'taxonomy' => 'methodology_tag',
                'field' => 'id',
                'terms' => $tags,
                'operator' => 'IN'
            ]
        ],
        // Для производительности
        'no_found_rows' => true,
        'update_post_meta_cache' => false,
        'update_post_term_cache' => true,
    ];

    // Если нужен объект WP_Query
    if (defined('RELATED_ARTICLES_AS_QUERY') && RELATED_ARTICLES_AS_QUERY) {
        return new WP_Query($args);
    }

    // Возвращаем массив постов
    $query = new WP_Query($args);
    $articles = $query->posts;

    wp_reset_postdata();

    return $articles;
}


function get_next_article($post_id = null)
{
    $next_post = get_adjacent_post(true, '', true, 'methodology_tag');

    if (empty($next_post)) {
        $next_post = current(get_related_articles(null, 1, []));
    }

    return $next_post;
}

function get_prev_article()
{
    $prev_post = get_adjacent_post(true, '', false, 'methodology_tag');
    $next_post = get_next_article();

    if (empty($prev_post)) {
        $prev_post = current(get_related_articles(null, 1, $next_post ? [$next_post->ID] : []));
    }

    return $prev_post;
}

function get_post_link($related_post, $class)
{
    if (empty($related_post)) {
        return "";
    }
    return '<a href="' . get_permalink($related_post) . '" class="' . $class . '">' . get_the_title($related_post) . "</a>";
}

?>