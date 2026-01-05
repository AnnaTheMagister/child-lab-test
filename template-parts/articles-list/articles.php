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
    <div class="row">
        <?php foreach ($posts as $key => $post): ?>
            <?php setup_postdata($post); ?>

            <div class="col-lg-3">
                <a class="article-card" href="<?php the_permalink(); ?>">
                    <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">
                        <div class="article-tags"></div>
                    </div>
                    <div class="article-details">
                        <div class="article-meta childlab-text childlab-text__meta">
                            <?php get_template_part('template-parts/article/meta'); ?>
                        </div>
                        <div class="childlab-text childlab-text__title">
                            <?php echo the_title(); ?>
                        </div>
                        <div class="childlab-text childlab-text__subtitle">
                            <?php the_field('subtitle'); ?>
                        </div>
                        <div class="childlab-text childlab-text__excerpt">
                            <?php echo the_excerpt(); ?>
                        </div>
                    </div>
                </a>
            </div>
        <?php endforeach; ?>
    </div>
</div>