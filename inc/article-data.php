<?php
function display_article_content($post_id = null)
{
    if (!$post_id) {
        $post_id = get_the_ID();
    }

    $mode = get_reading_mode();

    switch ($mode) {
        case 'scientist_long':
            $content = get_field('for_scientist_long', $post_id);
            $class = 'mode-scientist-long';
            break;

        case 'scientist_short':
            $content = get_field('for_scientist_short', $post_id);
            $class = 'mode-scientist-short';
            break;

        case 'parent_long':
            $content = get_field('for_parent_long', $post_id);
            $class = 'mode-parent-long';
            break;

        case 'parent_short':
            $content = get_field('for_parent_short', $post_id);
            $class = 'mode-parent-short';
            break;

        default:
            $content = get_field('preview', $post_id);
            $class = 'mode-default';
    }

    // $content = get_the_content(null, false, $content);
    if (empty($content)) {
        // Если поле пустое, показываем стандартный контент
        $content = get_the_content(null, false, $post_id);
    }

    $content = add_anchor_ids_to_headings($content);

    // Обертываем в div с классом режима
    return '<div class="article-content ' . esc_attr($class) . '">' . $content . '</div>';
}

function get_article_tags_render($post_id)
{
    $tags = get_the_terms(get_post($post_id), 'methodology_tag');
    $tags_render = '';
    if ($tags && !is_wp_error($tags)) {
        foreach ($tags as $tag) {
            $color = get_field('color', $tag) ?? 'rgba(100, 100, 100, 0.5)';
            $tags_render .= '<div class="article-tags__tag truncate" title="' . $tag->name . '" style="background-color: ' . $color . '">' . $tag->name . '</div>';
        }
    }
    return "<div class='article-tags'>{$tags_render}</div>";
}

?>