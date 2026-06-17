<?php
/**
 * Template Name: Курс
 * Template Post Type: courses
 */

get_header();
?>

<div id="course-banner-component" data-post-id="<?php echo get_the_ID(); ?>"></div>

<!-- Main content area -->
<div class="container course-content">
    <div class="course-main-content">
        <?php the_content(); ?>
    </div>
</div>

<?php get_footer(); ?>