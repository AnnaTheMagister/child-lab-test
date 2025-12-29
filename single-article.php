<?php
/**
 * Template Name: Статья
 * Template Post Type: article
 */

get_header();

// Получаем текущий режим просмотра
$reading_mode = get_reading_mode(); // Ваша функция
$post_id = get_the_ID();
?>

<!-- Прогресс-бар чтения -->
<?php get_template_part('template-parts/global/reading-progress'); ?>

<main class="article-main">
    
    <!-- Переключатель режимов -->
    <?php get_template_part('template-parts/article/mode-switcher'); ?>
    
    <div class="article-container">
        
        <!-- Боковая панель с оглавлением -->
        <aside class="article-sidebar">
            <?php get_template_part('template-parts/article/toc'); ?>
        </aside>
        
        <!-- Основной контент -->
        <article class="article-content-wrapper" data-post-id="<?php echo $post_id; ?>">
            
            <!-- Заголовок статьи -->
            <?php get_template_part('template-parts/article/header'); ?>
            
            <!-- Метаданные -->
            <?php get_template_part('template-parts/article/meta'); ?>
            
            <!-- Контент в выбранном режиме -->
            <?php get_template_part('template-parts/article/content'); ?>
            
            <!-- Навигация по разделам -->
            <?php get_template_part('template-parts/article/navigation'); ?>
            
            <!-- Похожие статьи -->
            <?php get_template_part('template-parts/article/related'); ?>
            
        </article>
        
    </div>
</main>

<?php get_footer(); ?>