<?php
$tags = get_terms(array('taxonomy' => 'methodology_tag', 'hide_empty' => false));
$default_svg_pattern = get_template_directory_uri() . '/assets/images/svg-patterns/all.svg';


if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container">
        <div class="flex-row-center methodology-tags-menu">
            <a href="<?php echo get_site_url() ?>/?methodology=-1"
                class="childlab-widget childlab-card-link methodology-tags-menu__tag"
                style="background-color: rgba(138, 214, 80, 1);">
                <div class="methodology-tags-menu__svg-background" data-svg-url="<?php $default_svg_pattern ?>"></div>
                Все
            </a>
            <?php foreach ($tags as $index => $tag): ?>
                <?php $items_in_row = 3 + ((count($tags) % 6)) / 2 + 1; ?>
                <?php $color = get_field('color', $tag) ?? 'rgba(100, 100, 100, 0.5)'; ?>
                <?php $svg_pattern = empty(get_field('svg_pattern', $tag)) ? $default_svg_pattern : get_field('svg_pattern', $tag); ?>
                <?php if ((($index + 1) % $items_in_row == 0)) {
                    echo '</div><div class="flex-row-center methodology-tags-menu">';
                } ?>
                <a href="?methodology=<?php echo $tag->term_id; ?>"
                    class="childlab-widget childlab-card-link methodology-tags-menu__tag"
                    style="background-color: <?php echo $color; ?>; max-width: calc(100% / <?php echo $items_in_row; ?>)">
                    <div class="methodology-tags-menu__svg-background" data-svg-url="<?php echo $svg_pattern ?>"></div>
                    <span title="<?php echo $tag->name; ?>" class="truncate"><?php echo $tag->name; ?></span>

                </a>
            <?php endforeach; ?>
        </div>
    </div>

<?php endif; ?>