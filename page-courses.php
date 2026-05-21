<?php
/**
 * Template Name: Страница курсов
 */

get_header();
?>

<div class="container">
    <main class="childlab-widget page-main">
        <div class="row">
            <div class="col-lg-12">
                <h1 class="page-title"><?php the_title(); ?></h1>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <?php
                // Выводим контент страницы (если есть)
                if (have_posts()):
                    while (have_posts()):
                        the_post();
                        the_content();
                    endwhile;
                endif;
                ?>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <?php get_template_part('template-parts/courses/courses-list'); ?>
            </div>
        </div>
    </main>
</div>

<?php get_footer(); ?>