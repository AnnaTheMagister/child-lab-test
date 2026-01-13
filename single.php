<?php
/**
 * Template Name: запись
 */

get_header();


?>


<main class="article-main">

    <div class="article-container">

        <div class="row">
            <div class="col-lg-3 order-lg-1 order-md-1 col-md-6 pr-4">
                <a class="nav-link-prev" href="<?php echo get_site_url(); ?>">На главную</a>

            </div>
            <div class="col-lg-6 order-lg-2 order-md-3 col-md-12">
                <!-- Основной заголовок -->
                <h1 class="article-title">
                    <?php the_title(); ?>
                </h1>
            </div>
        </div>

        <div class="row">
            <!-- Боковая панель -->
            <aside class="col-lg-3 col-md-12 article-sidebar">
                <!-- Оглавление -->
                <?php echo generate_table_of_contents(get_the_content()); ?>

            </aside>

            <!-- Основной контент -->
            <article class="col-lg-9 col-md-12 article-content-wrapper" data-post-id="<?php echo $post_id; ?>">

                <?php the_content(); ?>

            </article>

        </div>
       
        <div class="row">
            <div class="col-lg-3 order-lg-1 order-md-1 col-md-6 pr-4">
                <a class="nav-link-prev" href="<?php echo get_site_url(); ?>">На главную</a>

            </div>
        </div>
    </div>
</main>



<?php get_footer(); ?>