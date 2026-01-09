<?php
$tags = get_terms('methodology_tag');
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container">
        <div class="flex-row-center methodology-tags-menu">
            <a href="?methodology_tag=-1" class="childlab-widget childlab-card-link methodology-tags-menu__tag"
                style="background-color: rgba(138, 214, 80, 1);">
                Все
            </a>
            <?php foreach ($tags as $index => $tag): ?>
                <?php $items_in_row = 3 + ((count($tags) % 6)) / 2 + 1; ?>
                <?php $color = get_field('color', $tag) ?? 'rgba(100, 100, 100, 0.5)'; ?>
                <?php if ((($index + 1) % $items_in_row == 0)) {
                    echo '</div><div class="flex-row-center methodology-tags-menu">';
                } ?>
                <a href="?methodology_tag=<?php echo $tag->term_id; ?>"
                    class="childlab-widget childlab-card-link methodology-tags-menu__tag"
                    style="background-color: <?php echo $color; ?>; max-width: calc(100% / <?php echo $items_in_row; ?>)">
                    <span title="<?php echo $tag->name; ?>" class="truncate"><?php echo $tag->name; ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

<?php endif; ?>