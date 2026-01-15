<?php $post_image_url = empty(get_the_post_thumbnail_url()) ? $GLOBALS['default_image'] : get_the_post_thumbnail_url(); ?>

<a class="article-card" href="<?php the_permalink(); ?>">
    <div class="article-img" style="background-image: url('<?php echo $post_image_url; ?>');">
        <?php echo get_article_tags_render(get_the_ID()); ?>
    </div>
    <div class="article-details">
        <div class="article-meta childlab-text__meta">
            <?php get_template_part('template-parts/article/meta'); ?>
        </div>
        <div class="article-details__title truncate-multiline">
            <?php echo the_title(); ?>
        </div>
        <div class="article-details__subtitle truncate">
            <?php the_field('subtitle'); ?>
        </div>
        <div class="article-details__excerpt truncate-multiline">
            <?php echo the_excerpt(); ?>
        </div>
    </div>
</a>