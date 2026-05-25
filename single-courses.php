<?php
/**
 * Template Name: Курс
 * Template Post Type: courses
 */

get_header();
?>

<!-- Course Banner via template part -->
<?php get_template_part('template-parts/course/banner'); ?>

<!-- Main content area -->
<div class="container course-content">
    <div class="row">
        <div class="col-lg-12">
            <div class="course-main-content">
                <?php the_content(); ?>
            </div>
        </div>
    </div>
</div>

<?php get_footer(); ?>