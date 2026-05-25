<?php
// Get post image URL with validation
$post_image_url = get_the_post_thumbnail_url($post->ID);
if (empty($post_image_url)) {
    $post_image_url = $GLOBALS['default_image'];
}

// Get course colors with fallbacks
$course_color = get_field('course_color') ?: '#EB3F9B';

// Calculate palette colors using addColors function
// If title color is not set, calculate it as #96195C (addColors('#EB3F9B', '#000000'))
$course_title_color = get_field('course_title_color') ?: addColors($course_color, '#000000');

// If button gradient color is not set, calculate it as #D745FF (addColors('#EB3F9B', '#3300FF'))
$course_button_gradient = get_field('course_button_gradient') ?: addColors($course_color, '#3300FF');

// If background color is not set, calculate it as #FFC7D8 (addColors('#EB3F9B', '#EEEEEE'))
$course_background_color = get_field('course_background_color') ?: addColors($course_color, '#AAAAAA');
?>

<!-- Course Banner -->
<div class="course-banner" style="background-image: url(<?php echo esc_url($post_image_url); ?>);">
    <div class="course-banner-overlay" style="background: linear-gradient(
        to top,
        <?php echo esc_attr($course_background_color)?> 0,
        rgba(255, 255, 255, 1) 100%
    )"></div>
    <div class="container course-banner-content">
        <div class="col-md-6 col-sm-12">
            <?php
            // Get course type terms for the banner
            $course_types = get_the_terms(get_the_ID(), 'course_type');
            if ($course_types && !is_wp_error($course_types)) {
                foreach ($course_types as $term) {
                    echo '<span class="course-type-tag" style="background-color: ' . esc_attr($course_color) . '; color: white;">' . esc_html($term->name) . '</span>';
                }
            }
            ?>
            <h1 class="course-banner-title" style="color: <?php echo esc_attr($course_title_color); ?>;"><?php the_title(); ?>
            </h1>
            <?php if (get_field('course_subtitle')): ?>
                <h2 class="course-banner-subtitle" style="color: <?php echo esc_attr($course_title_color); ?>;">
                    <?php the_field('course_subtitle'); ?></h2>
            <?php endif; ?>
            <?php if (get_field('course_short_description')): ?>
                <div class="course-banner-description" style="color: <?php echo esc_attr($course_title_color); ?>">
                    <?php the_field('course_short_description'); ?>
                </div>
            <?php endif; ?>
            <?php if (get_field('course_access_link')): ?>
                <a href="<?php echo esc_url(get_field('course_access_link')); ?>" class="course-access-button"
                    style="background: linear-gradient(135deg, <?php echo esc_attr($course_color); ?> 0%, <?php echo esc_attr($course_button_gradient); ?> 100%); border-color: <?php echo esc_attr($course_color); ?>;"
                    target="_blank">
                    <?php esc_html_e('Получить доступ', 'childlab'); ?>
                </a>
            <?php endif; ?>
        </div>
    </div>
</div>