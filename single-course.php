<?php
/**
 * Template Name: Курс
 * Template Post Type: courses
 */

get_header();
?>

<?php
$post_image_url = empty(get_the_post_thumbnail_url($post->ID)) ? $GLOBALS['default_image'] :
    get_the_post_thumbnail_url($post->ID);
    
// Получаем цвета курса
$course_color = get_field('course_color') ?: '#EB3F9B';
$background_color = get_course_background_color();
?>

<!-- Full-width banner with fixed height -->
<div class="course-banner" style="background-image: url(<?php echo $post_image_url; ?>); height: 500px; background-size: cover; background-position: center;">
    <div class="container course-banner-content">
        <h1 class="course-banner-title" style="color: <?php echo $course_color; ?>; font-size: 120px;"><?php the_title(); ?></h1>
        <?php if (get_field('course_subtitle')): ?>
            <h2 class="course-banner-subtitle" style="color: <?php echo $course_color; ?>; font-size: 60px;"><?php the_field('course_subtitle'); ?></h2>
        <?php endif; ?>
        <?php if (get_field('course_short_description')): ?>
            <div class="course-banner-description">
                <?php the_field('course_short_description'); ?>
            </div>
        <?php endif; ?>
        <?php if (get_field('course_access_link')): ?>
            <a href="<?php the_field('course_access_link'); ?>" class="course-access-button" style="background-color: <?php echo $course_color; ?>; border-color: <?php echo $course_color; ?>;" target="_blank">
                <?php esc_html_e('Получить доступ', 'childlab'); ?>
            </a>
        <?php endif; ?>
    </div>
</div>

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