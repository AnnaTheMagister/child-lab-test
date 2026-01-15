<?php


function get_methodology_tag()
{
    return $_GET['methodology'] ?? '-1'; // По умолчанию
}


function get_articles_list_by_taxonomy($taxonomy, $term_id, $title, $empty_placeholder_msg = 'Нет статей по этой теме')
{
    $posts = get_posts(array(
        'numberposts' => -1,
        'orderby' => 'date',
        'order' => 'ASC',
        'post_type' => 'article',
        'tax_query' => [
            [
                'taxonomy' => $taxonomy,
                'field' => 'id',
                'terms' => [$term_id],
                'operator' => 'IN'
            ]
        ],
        'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
    ));



    $header = '<header class="articles-list__header">' . $title ? $title : "Статьи" . '</header>';

    $empty_placeholder = '<div class="empty-placeholder">' . $empty_placeholder_msg . '</div>';


    $articles_list = '';

    foreach ($posts as $key => $post) {
        the_post($post);
        $articles_list .= '<div class="col-lg-3 col-md-6 col-sm-12">' . get_article_card() . '</div>';

        wp_reset_postdata();
    }


    return "<div class='childlab-widget'>{$header}<div class='row'>{$articles_list}</div></div>";
}

function get_article_card()
{
    $post_image_url = empty(get_the_post_thumbnail_url()) ? $GLOBALS['default_image'] : get_the_post_thumbnail_url();

    $tags_render = get_article_tags_render(get_the_ID());
    $article_image_render = "<div class='article-img' style='background-image: url(" . $post_image_url . ");'>" . $tags_render . "</div>";

    $article_meta_render = "<div class='article-meta childlab-text__meta'>" . get_article_meta_render() . '</div>';

    $article_title_render = "<div class='article-details__title truncate-multiline'>" . get_the_title() . "</div>";

    $article_subtitle_render = "<div class='article-details__subtitle truncate'>" . get_field('subtitle') . "</div>";

    $article_excerpt_render = "<div class='article-details__excerpt truncate-multiline'>" . get_the_excerpt() . "</div>";

    $article_content_render = '<div article-details>' . $article_meta_render . $article_title_render . $article_subtitle_render . $article_excerpt_render . '</div>';

    return "<a class='article-card' href='" . get_the_permalink() . "'>" . $article_image_render . $article_content_render . "</a>";
}


?>