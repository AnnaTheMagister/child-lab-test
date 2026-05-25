<?php
/**
 * Template Name: Страница команды
 */

get_header();


?>

<div class="container">
    <?php the_content(); ?>
</div>
<?php get_template_part('template-parts/team/team-list'); ?>

<?php get_footer(); ?>