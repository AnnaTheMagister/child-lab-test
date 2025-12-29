<?php
// В single-article.php или article-card.php
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

    // Обертываем в div с классом режима
    echo '<div class="article-content ' . esc_attr($class) . '">' . $content . '</div>';
}
?>



<!-- В шаблоне статьи -->
<article>

    <?php display_article_content(); ?>

</article>