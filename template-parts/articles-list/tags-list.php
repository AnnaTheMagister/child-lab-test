<?php
$tags = get_terms('methodology_tag');
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container">
        <div class="main-tags-list">
            <a href="" class="main-methodology-tag" style="background-color: rgba(138, 214, 80, 1);">
                Все
            </a>
            <?php foreach ($tags as $tag): ?>
                <?php $color = get_field('color', $tag) ?? 'rgba(100, 100, 100, 0.5)'; ?>
                <a href="?methodology_tag=<?php echo $tag->term_id; ?>" class="main-methodology-tag"
                    style="background-color: <?php echo $color; ?>">
                    <?php echo $tag->name; ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

<?php endif; ?>