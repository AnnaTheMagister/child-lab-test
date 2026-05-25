<?php
$tags = get_terms(array('taxonomy' => 'article_author', 'hide_empty' => false));
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container authors-list">
        <div class="row">
            <?php foreach ($tags as $tag): ?>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                    <?php get_template_part('template-parts/team/author-card', null, array('member' => $tag)); ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

<?php endif; ?>