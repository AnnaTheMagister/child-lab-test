<a class="article-card" href="<?php the_permalink(); ?>">
    <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">
        <?php get_template_part('template-parts/article/tags'); ?>
    </div>
    <div class="article-details">
        <div class="article-meta childlab-text childlab-text__meta">
            <?php get_template_part('template-parts/article/meta'); ?>
        </div>
        <div class="childlab-text childlab-text__title truncate">
            <?php echo the_title(); ?>
        </div>
        <div class="childlab-text childlab-text__subtitle truncate">
            <?php the_field('subtitle'); ?>
        </div>
        <div class="childlab-text childlab-text__excerpt truncate">
            <?php echo the_excerpt(); ?>
        </div>
    </div>
</a>