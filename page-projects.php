<?php
/**
 * Template Name: Страница проекты
 * Template Post Type: project
 */

get_header();
?>

<div class="container">
    <?php the_content(); ?>
</div>
<div class="container">
    <?php get_template_part('template-parts/projects/projects-list'); ?>
</div>
<?php get_footer(); ?>