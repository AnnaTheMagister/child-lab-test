<?php
$tags = get_terms('article_author');
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container authors-list">
        <div class="row">
            <?php foreach ($tags as $tag): ?>
                <?php session_start(); ?>
                <?php $_SESSION['team_member'] = $tag; ?>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                    <?php get_template_part('template-parts/team/author-card'); ?>
                </div>
                <?php session_abort(); ?>
            <?php endforeach; ?>
        </div>
    </div>

<?php endif; ?>