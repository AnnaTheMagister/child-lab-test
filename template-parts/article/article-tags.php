<!-- Теги -->
<?php
$tags = get_the_terms(get_the_ID(), 'methodology_tag');
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="article-tags">
        <?php foreach ($tags as $tag): ?>
            <?php $color = get_field('color', $tag) ?? 'rgba(100, 100, 100, 0.5)'; ?>
            <div class="article-tags__tag truncate" title="<?php echo $tag->name; ?>"
                style="background-color: <?php echo $color; ?>">
                <?php echo $tag->name; ?>
            </div>
        <?php endforeach; ?>
    </div>
<?php endif; ?>