<?php
// Контент статьи в зависимости от режима
$content = '';
$field_map = [
    'scientist_long' => 'for_scientist_long',
    'scientist_short' => 'for_scientist_short',
    'parent_long' => 'for_parent_long',
    'parent_short' => 'for_parent_short',
];

$field_name = $field_map[$reading_mode] ?? 'for_scientist_long';
$content = get_field($field_name);

// Если поле пустое, используем стандартный контент
if (empty($content)) {
    $content = get_the_content();
}

// Применяем фильтры WordPress
$content = apply_filters('the_content', $content);

// Добавляем якоря к заголовкам для навигации
$content = add_anchor_ids_to_headings($content);
?>

<div class="article-content mode-<?php echo $reading_mode; ?>">

    <!-- Блок с кнопками действий -->
    <?php if (!in_array($reading_mode, ['parent_short', 'scientist_short'])): ?>
        <div class="article-actions">
            <button class="action-btn print-article" title="Распечатать">
                🖨️ Печать
            </button>
            <button class="action-btn save-article" title="Сохранить">
                💾 Сохранить
            </button>
            <button class="action-btn share-article" title="Поделиться">
                🔗 Поделиться
            </button>
        </div>
    <?php endif; ?>

    <!-- Основной контент -->
    <div class="content-wrapper">
        <?php echo $content; ?>
    </div>

    <!-- Ключевые тезисы (только для полных версий) -->
    <?php
    if (
        in_array($reading_mode, ['scientist_long', 'parent_long']) &&
        have_rows('key_points')
    ):
        ?>
        <div class="key-points-summary">
            <h3>📌 Ключевые тезисы</h3>
            <ul class="key-points-list">
                <?php while (have_rows('key_points')):
                    the_row(); ?>
                    <li>
                        <span class="point-icon icon-<?php the_sub_field('point_icon'); ?>"></span>
                        <span class="point-text"><?php the_sub_field('point_text'); ?></span>
                    </li>
                <?php endwhile; ?>
            </ul>
        </div>
    <?php endif; ?>

</div>
