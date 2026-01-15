<?php
/**
 * Template Name: Статья
 * Template Post Type: article
 */

get_header();

// Получаем текущий режим просмотра
$GLOBALS['mode'] = get_reading_mode();
?>

<div class="article-wrapper article-wrapper-article">

    <main class="article-main">

        <div class="article-container">

            <!-- Заголовок статьи -->
            <?php get_template_part('template-parts/article/header'); ?>

            <div class="row">
                <!-- Боковая панель -->
                <aside class="col-lg-3 col-md-12 article-sidebar">
                    <!-- Оглавление -->
                    <?php get_template_part('template-parts/article/toc'); ?>
                    <!-- Переключатель режимов -->
                    <?php get_template_part('template-parts/article/mode-toggler'); ?>
                </aside>

                <!-- Основной контент -->
                <article class="col-lg-9 col-md-12 article-content-wrapper" data-post-id="<?php echo $post_id; ?>">

                    <!-- Контент в выбранном режиме -->
                    <?php get_template_part('template-parts/article/mode-content'); ?>

                </article>

            </div>
            <!-- Подвал статьи с навигацией -->
            <?php get_template_part('template-parts/article/footer'); ?>
        </div>
    </main>

</div>

<?php get_footer(); ?>