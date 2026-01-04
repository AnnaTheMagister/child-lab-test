<?php
/**
 * Template Name: Статья
 * Template Post Type: article
 */

get_header();

// Получаем текущий режим просмотра
$GLOBALS['mode'] = get_reading_mode();
$post_id = get_the_ID();
?>


<main class="article-main">

    <div class="article-container">

        <!-- Заголовок статьи -->
        <?php get_template_part('template-parts/article/header'); ?>

        <div class="row">
            <!-- Боковая панель -->
            <aside class="col-sm-3 article-sidebar">
                <!-- Оглавление -->
                <?php get_template_part('template-parts/article/toc'); ?>
                <!-- Переключатель режимов -->
                <?php get_template_part('template-parts/article/mode-toggler'); ?>
            </aside>

            <!-- Основной контент -->
            <article class="col-sm-9 article-content-wrapper" data-post-id="<?php echo $post_id; ?>">

                <!-- Контент в выбранном режиме -->
                <?php get_template_part('template-parts/article/mode-content'); ?>

            </article>

        </div>
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