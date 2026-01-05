<?php
// Метаданные статьи
$difficulty = get_field('difficulty_level');
$reading_time = get_field('reading_time');
$authors = get_field('article_authors'); // Связь с team_member
$published_date = get_the_date('d.m.Y');
$updated_date = get_the_modified_date('d.m.Y');

// Авторасчет времени чтения, если не указано
if (!$reading_time || $reading_time == 0) {
    $word_count = str_word_count(strip_tags(get_the_content()));
    $reading_time = ceil($word_count / 200); // 200 слов в минуту
}
?>

<div class="article-meta">
    
    <!-- Авторы -->
    <?php if ($authors && !in_array($reading_mode, ['parent_short', 'scientist_short'])): ?>
    <div class="meta-authors">
        <span class="meta-label">Авторы:</span>
        <div class="authors-list">
            <?php foreach ($authors as $author): ?>
            <a href="<?php echo get_permalink($author->ID); ?>" class="author-link">
                <?php echo get_the_title($author->ID); ?>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>
    
    <!-- Дата -->
    <?php if (!in_array($reading_mode, ['parent_short'])): ?>
    <div class="meta-dates">
        <span class="meta-label">Опубликовано:</span>
        <time datetime="<?php echo get_the_date('c'); ?>"><?php echo $published_date; ?></time>
        
        <?php if ($published_date != $updated_date): ?>
        <span class="meta-updated">
            (обновлено: <time datetime="<?php echo get_the_modified_date('c'); ?>">
                <?php echo $updated_date; ?>
            </time>)
        </span>
        <?php endif; ?>
    </div>
    <?php endif; ?>
    
    <!-- Время чтения -->
    <div class="meta-reading-time">
        <span class="meta-label">Время чтения:</span>
        <span class="reading-time">~<?php echo $reading_time; ?> мин.</span>
    </div>
    
    <!-- Сложность -->
    <?php if ($difficulty && $reading_mode == 'scientist_long'): ?>
    <div class="meta-difficulty">
        <span class="meta-label">Сложность:</span>
        <span class="difficulty-level level-<?php echo $difficulty; ?>">
            <?php 
            $difficulty_labels = [
                'beginner' => 'Начальный',
                'intermediate' => 'Средний',
                'advanced' => 'Продвинутый',
            ];
            echo $difficulty_labels[$difficulty] ?? $difficulty;
            ?>
        </span>
    </div>
    <?php endif; ?>
    
    <!-- Теги -->
    <?php 
    $tags = get_the_terms(get_the_ID(), 'article_tag');
    if ($tags && !is_wp_error($tags)):
    ?>
    <div class="meta-tags">
        <span class="meta-label">Теги:</span>
        <div class="tags-list">
            <?php foreach ($tags as $tag): ?>
            <a href="<?php echo get_term_link($tag); ?>" class="tag">
                <?php echo $tag->name; ?>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>
    
</div>