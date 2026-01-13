<?php

function get_article_author_name($author_term)
{
    $author_id = $author_term->term_id;
    $first_name = get_field('first_name', 'article_author_' . $author_id);
    $last_name = get_field('last_name', 'article_author_' . $author_id);

    if ($first_name && $last_name) {
        return esc_html($first_name . ' ' . $last_name);
    } else {
        return esc_html($author_term->name);
    }
}

function get_article_author_image($author_term)
{
    return empty(get_field('photo', $author_term)) ? $GLOBALS['unknown_user_image'] : get_field('photo', $author_term);
}

?>