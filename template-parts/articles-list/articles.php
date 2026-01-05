<?php

$posts = get_posts(array(
    'numberposts' => -1,
    'orderby' => 'date',
    'order' => 'ASC',
    'post_type' => 'article',
    'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
));
$posts_size = count($posts);
?>

<div class="container">

    <?php foreach ($posts as $key => $post): ?>
        <?php setup_postdata($post); ?>
        <?php if ($key % 4 == 0): ?>
            <div class="row">
            <?php endif; ?>
            <div class="col-lg-3 col-md-6 col-sm-12">
                <?php get_template_part('template-parts/articles-list/article-card'); ?>
            </div>
            <?php if ($key % 4 == 3): ?>
            </div>
        <?php endif; ?>
    <?php endforeach; ?>
</div>
</div>