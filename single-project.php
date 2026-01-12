<?php
/**
 * Template Name: Проект
 * Template Post Type: project
 */

get_header();


?>


<main class="article-main">

    <div class="article-container">

        <!-- Заголовок статьи -->
        <?php get_template_part('template-parts/article/header'); ?>
        
        <div class="row">
            <!-- Основной контент -->
            <!-- <article class="col-lg-9 col-md-12 article-content-wrapper" data-post-id="<?php echo $post_id; ?>"> -->

                <!-- Контент в выбранном режиме -->
                <!-- <?php get_template_part('template-parts/article/mode-content'); ?> -->

            <!-- </article> -->

        </div>
        <!-- Подвал статьи с навигацией -->
        <?php get_template_part('template-parts/article/footer'); ?>
    </div>
</main>



<?php get_footer(); ?>