<?php
// Заголовок статьи с подзаголовком из ACF
$subtitle = get_field('subtitle');
?>

<header>
    <div class="row">
        <div class="col-lg-3 order-lg-1 order-md-1 col-md-6 pr-4">
            <?php echo get_post_link(get_prev_article(), "nav-link-prev") ?>
        </div>
        <div class="col-lg-6 order-lg-2 order-md-3 col-md-12">
            <!-- Основной заголовок -->
            <h1 class="article-title">
                <?php the_title(); ?>
            </h1>
            <?php if (get_field("subtitle")): ?>
                <h2 class="article-subtitle">
                    <?php the_field("subtitle"); ?>
                </h2>
            <?php endif; ?>
            <div class="article-meta-container">
                <?php get_template_part('template-parts/article/meta'); ?>
                <?php get_template_part('template-parts/article/tags'); ?>
            </div>
        </div>
        <div class="col-lg-3 order-lg-3 order-md-2 col-md-6 pl-4">
            <?php echo get_post_link(get_next_article(), "nav-link-next") ?>
        </div>
    </div>
</header>