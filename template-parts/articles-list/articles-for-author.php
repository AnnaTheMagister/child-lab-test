<?php

$author_term = get_queried_object();
$author_id = $author_term->term_id;

$current_tag = get_methodology_tag();


$posts = get_posts(array(
    'numberposts' => -1,
    'orderby' => 'date',
    'order' => 'ASC',
    'post_type' => 'article',
    'tax_query' => [
        [
            'taxonomy' => 'article_author',
            'field' => 'id',
            'terms' => [$author_id],
            'operator' => 'IN'
        ]
    ],
    'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
));


$posts_size = count($posts);
?>


<div class="container">
    <div class="childlab-widget">
        <header class="articles-list__header">
            Статьи автора
        </header>
        <?php foreach ($posts as $key => $post): ?>
            <?php setup_postdata($post); ?>
            <?php if ($key % 4 == 0): ?>
                <div class="row">
                <?php endif; ?>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <?php get_template_part('template-parts/articles-list/article-card'); ?>
                </div>
                <?php if ($key % 4 == 3 || $key == $posts_size - 1): ?>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
</div>

<?php
wp_reset_postdata(); // сброс
?>