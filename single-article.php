<?php
/**
 * Template Name: Статья
 * Template Post Type: article
 */

get_header();

// Получаем текущий режим просмотра
$reading_mode = get_reading_mode();
$post_id = get_the_ID();
?>


<main class="article-main">


    <div class="article-container">

        <!-- Заголовок статьи -->
        <?php get_template_part('template-parts/article/header'); ?>

        <!-- Боковая панель с оглавлением -->
        <!-- <aside class="article-sidebar">
            <?php get_template_part('template-parts/article/toc'); ?>
        </aside> -->

        <!-- Основной контент -->
        <article class="article-content-wrapper" data-post-id="<?php echo $post_id; ?>">
            <!-- Переключатель режимов -->
            <?php get_template_part('template-parts/article/mode-toggler'); ?>

            <!-- Контент в выбранном режиме -->
            <?php get_template_part('template-parts/article/mode-content'); ?>

        </article>

    </div>


    <!-- Переключатель режимов (большой) -->
    <?php
    // get_template_part('template-parts/article/mode-switcher');
    ?>

    <!-- Навигация по разделам -->
    <?php
    // get_template_part('template-parts/article/navigation');
    ?>

    <!-- Похожие статьи -->
    <?php
    // get_template_part('template-parts/article/related'); 
    ?>

    <!-- Метаданные -->
    <?php
    // get_template_part('template-parts/article/meta');
    ?>

    <!-- Контент в выбранном режиме -->
    <?php
    // get_template_part('template-parts/article/content');
    ?>
</main>



<?php get_footer(); ?>