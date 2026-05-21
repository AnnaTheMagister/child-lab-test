<?php
/**
 * Template Name: Курс
 * Template Post Type: courses
 */

get_header();

// Получаем текущий режим просмотра
$GLOBALS['mode'] = get_reading_mode();
?>

<?php $post_image_url = empty(get_the_post_thumbnail_url($post->ID)) ? $GLOBALS['default_image'] :
    get_the_post_thumbnail_url($post->ID); ?>

<div class="article-background" style="background-image: url(<?php echo $post_image_url; ?>)"></div>

<div class="container">
    <main class="childlab-widget article-main">

        <!-- Заголовок курса -->
        <div class="row">
            <div class="col-lg-3 order-lg-1 order-md-1 col-md-6 col-xs-6 pr-4">
                <?php echo get_post_link(get_prev_post(), "nav-link-prev") ?>
            </div>
            <div class="col-lg-6 order-lg-2 order-md-3 col-md-12 order-xs-3 col-xs-12">
                <!-- Основной заголовок -->
                <h1 class="article-title">
                    <?php the_title(); ?>
                </h1>
                <div class="course-meta-container">
                    <?php if (get_field('course_duration')): ?>
                        <div class="course-meta-item">
                            <span class="course-meta-label">Длительность:</span>
                            <span class="course-meta-value"><?php the_field('course_duration'); ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (get_field('course_level')): ?>
                        <div class="course-meta-item">
                            <span class="course-meta-label">Уровень:</span>
                            <span class="course-meta-value"><?php the_field('course_level'); ?></span>
                        </div>
                    <?php endif; ?>
                    
                    <?php 
                    $audience = get_field('course_audience');
                    if ($audience): ?>
                        <div class="course-meta-item">
                            <span class="course-meta-label">Для:</span>
                            <span class="course-meta-value">
                                <?php 
                                $audience_labels = array();
                                foreach ($audience as $aud) {
                                    if ($aud == 'parents') $audience_labels[] = 'Родителей';
                                    if ($aud == 'teachers') $audience_labels[] = 'Педагогов';
                                }
                                echo implode(', ', $audience_labels);
                                ?>
                            </span>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            <div class="col-lg-3 order-lg-3 order-md-2 col-md-6 col-xs-6 pl-4">
                <?php echo get_post_link(get_next_post(), "nav-link-next") ?>
            </div>
        </div>

        <div class="row">
            <!-- Боковая панель -->
            <aside class="col-lg-3 col-md-12 col-xs-12 article-sidebar">
                <!-- Оглавление -->
                <?php if (function_exists('generate_table_of_contents')): ?>
                    <?php echo generate_table_of_contents(get_the_content()); ?>
                <?php endif; ?>
                <!-- Переключатель режимов -->
                <?php get_template_part('template-parts/article/mode-toggler'); ?>
            </aside>

            <!-- Основной контент -->
            <article class="col-lg-9 col-md-12 col-xs-12 article-content-wrapper"
                data-post-id="<?php echo $post_id; ?>">

                <!-- Контент курса -->
                <?php the_content(); ?>

            </article>

        </div>
        <!-- Подвал курса с навигацией -->
        <div class="row">
            <div class="col-lg-3 order-lg-1 order-md-1 col-md-6 col-xs-6 pr-4">
                <a class="nav-link-prev" href="<?php echo get_site_url(); ?>/courses">
                    <?php esc_html_e('К курсам', 'childlab'); ?>
                </a>
            </div>
        </div>

    </main>

</div>

<?php get_footer(); ?>