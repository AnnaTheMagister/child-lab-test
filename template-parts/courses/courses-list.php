<?php

$posts = get_posts(array(
    'numberposts' => -1,
    'orderby' => 'date',
    'order' => 'ASC',
    'post_type' => 'courses',
    'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
));
?>
<div class="courses-list">

    <?php
    foreach ($posts as $key => $post) {
        setup_postdata($post);

        // Get course color for gradient
        $course_color = get_field('course_color', $post->ID);
        if (!$course_color) {
            $course_color = '#EB3F9B'; // Default color if not set
        }
        
        // Get background image
        $img_courses = empty(get_the_post_thumbnail_url()) ? $GLOBALS['default_projects_image'] : get_the_post_thumbnail_url();
        ?>
        
        <div class="childlab-widget courses" style="--course-color: <?php echo esc_attr($course_color); ?>">
            <div class="courses-banner-wrapper" style="background-image: url('<?php echo esc_url($img_courses); ?>');">
                <div class="courses-banner-gradient-overlay"></div>
            </div>
            <h2 class="course-title" title="<?php the_title(); ?>"><?php the_title(); ?></h2>
            <?php if (get_field('course_subtitle')): ?>
                <div class="course-subtitle"><?php the_field('course_subtitle'); ?></div>
            <?php endif; ?>
            <div class="course-description truncate-multiline"><?php the_field('course_description'); ?></div>
            <a class="course-link" href="<?php the_permalink(); ?>">
                <div><?php esc_html_e("Подробнее", "childlab") ?></div> <img class="svg-icon"
                    src="<?php echo get_template_directory_uri() . '/assets/images/arrow-right.svg' ?>" />
            </a>
        </div>



        <?php
        wp_reset_postdata(); // сброс
        ?>

    <?php } ?>


</div>