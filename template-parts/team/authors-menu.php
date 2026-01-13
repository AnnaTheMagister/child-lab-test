<?php
$tags = get_terms(array('taxonomy' => 'article_author', 'hide_empty' => false));
$author_term = get_queried_object();
$author_id = $author_term->term_id;

if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container authors-menu">
        <div class="flex-row-center">
            <?php foreach ($tags as $index => $tag): ?>
                <a href="<?php echo get_term_link($tag) ?>"
                    class="authors-menu__item <?php echo $tag->term_id == $author_id ? 'active' : '' ?>">
                    <?php echo get_article_author_name($tag); ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
<?php endif; ?>