<!-- Теги -->
<?php
$tags = get_the_terms(get_the_ID(), 'methodology_tag');
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="meta-tags">
        <div class="tags-list">
            <?php foreach ($tags as $tag): ?>
                <a href="<?php echo get_term_link($tag); ?>" class="tag">
                    <?php echo $tag->name; ?>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
<?php endif; ?>