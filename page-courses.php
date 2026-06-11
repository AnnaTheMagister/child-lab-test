<?php
/**
 * Template Name: Страница курсов
 * 
 * @package childlab
 */

get_header();
?>

<div class="container">
    <?php the_content(); ?>
</div>
<div class="container">
    <div id="courses-list-component"></div>
</div>

<?php get_footer(); ?>