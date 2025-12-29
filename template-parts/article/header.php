<?php
// Заголовок статьи с подзаголовком из ACF
$subtitle = get_field('subtitle');
?>

<header class="article-header">
    
    <!-- Хлебные крошки -->
    <nav class="article-breadcrumbs">
        <?php
        if (function_exists('yoast_breadcrumb')) {
            yoast_breadcrumb('<p class="breadcrumbs">', '</p>');
        } else {
            ?>
            <a href="<?php echo home_url(); ?>">Главная</a> / 
            <a href="<?php echo get_post_type_archive_link('article'); ?>">Статьи</a> / 
            <span><?php the_title(); ?></span>
            <?php
        }
        ?>
    </nav>
    
    <!-- Основной заголовок -->
    <h1 class="article-title">
        <?php the_title(); ?>
        
        <?php if ($subtitle): ?>
        <span class="article-subtitle"><?php echo esc_html($subtitle); ?></span>
        <?php endif; ?>
    </h1>
    
    <!-- Индикатор текущего режима -->
    <div class="current-mode-indicator">
        <span class="mode-label">
            <?php 
            $mode_labels = [
                'scientist_long' => '🔬 Режим для ученых (полная версия)',
                'scientist_short' => '🔬 Режим для ученых (кратко)',
                'parent_long' => '👨‍👩‍👧 Режим для родителей (полная версия)',
                'parent_short' => '👨‍👩‍👧 Режим для родителей (кратко)',
            ];
            echo $mode_labels[$reading_mode] ?? $mode_labels['scientist_long'];
            ?>
        </span>
        
        <button class="change-mode-btn" data-action="open-mode-switcher">
            Изменить режим
        </button>
    </div>
    
</header>