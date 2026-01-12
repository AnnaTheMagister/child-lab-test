<div class="my-container">
    <div class="my-container">
    
</div>
</div>
<script>

    // Можно обновить настройки
    setTimeout(() => {
         const starSVG = 'http://localhost/childlab.local/wp-content/themes/childlab-react/assets/images/svg.svg';

        // Создаем паттерн
        const pattern = createSVGPattern('.my-container', starSVG, {
            count: 10,
            // minScale: 0.4,
            // maxScale: 1.2,
            minRotate: -90,
            maxRotate: 90,
            // spacing: 30,
            opacity: 0.5
        });
    }, 3000);
</script>



<?php
$tags = get_terms('methodology_tag');
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container">
        <div class="flex-row-center methodology-tags-menu">
            <a href="<?php echo get_site_url() ?>/?methodology=-1"
                class="childlab-widget childlab-card-link methodology-tags-menu__tag"
                style="background-color: rgba(138, 214, 80, 1);">
                Все
            </a>
            <?php foreach ($tags as $index => $tag): ?>
                <?php $items_in_row = 3 + ((count($tags) % 6)) / 2 + 1; ?>
                <?php $color = get_field('color', $tag) ?? 'rgba(100, 100, 100, 0.5)'; ?>
                <?php if ((($index + 1) % $items_in_row == 0)) {
                    echo '</div><div class="flex-row-center methodology-tags-menu">';
                } ?>
                <a href="?methodology=<?php echo $tag->term_id; ?>"
                    class="childlab-widget childlab-card-link methodology-tags-menu__tag"
                    style="background-color: <?php echo $color; ?>; max-width: calc(100% / <?php echo $items_in_row; ?>)">
                    <span title="<?php echo $tag->name; ?>" class="truncate"><?php echo $tag->name; ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>

<?php endif; ?>