<?php
$tags = get_terms('article_author');
if ($tags && !is_wp_error($tags)):
    ?>
    <div class="container authors-list">
        <div class="flex-row-center">
            <?php foreach ($tags as $tag): ?>
                <?php session_start(); ?>
                <?php $_SESSION['team_member'] = $tag; ?>
                <?php get_template_part('template-parts/team/team-member-card'); ?>

                <?php session_abort(); ?>
            <?php endforeach; ?>
        </div>
    </div>

<?php endif; ?>