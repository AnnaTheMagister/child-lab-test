<?php
/**
 * Template Name: запись
 */

get_header();


?>

<?php $post_image_url = empty(get_the_post_thumbnail_url($post->ID)) ? $GLOBALS['default_image'] :
    get_the_post_thumbnail_url($post->ID); ?>


<?php
$content = apply_filters('the_content', get_the_content());
$content = add_anchor_ids_to_headings($content);
$toc = generate_table_of_contents(get_the_content());

function get_back_link()
{
    $post_type = get_post_type();
    $link = '<a class="nav-link-prev" href=' . get_site_url() . '>' . esc_html__('На главную', 'childlab') . '</a>';
    if ($post_type === 'projects') {
        $link = '<a class="nav-link-prev" href=' . get_site_url() . '/projects' . '>' . esc_html__('К проектам', 'childlab') . '</a>';
    }
    return '<div class="col-lg-3 order-lg-1 order-md-1 col-md-6 col-xs-6 pr-4">' . $link . '</div>';
}

?>


<div class="article-background" style="background-image: url(<?php echo $post_image_url; ?>)"></div>


<div class="container">
    <main class="childlab-widget article-main">

        <div class="row">
            <?php echo get_back_link(); ?>
            <div class="col-lg-6 order-lg-2 order-md-3 col-md-12">
                <!-- Основной заголовок -->
                <h1 class="article-title">
                    <?php the_title(); ?>
                </h1>
            </div>
        </div>

        <div class="row">
            <!-- Боковая панель -->
            <?php if (!empty($toc)): ?>
                <aside class="col-lg-3 col-md-12 col-xs-12 article-sidebar">
                    <!-- Оглавление -->
                    <?php echo $toc; ?>

                </aside>
            <?php endif; ?>

            <!-- Основной контент -->
            <article class="col-lg-9 col-md-12 col-xs-12 article-content-wrapper"
                data-post-id="<?php echo $post_id; ?>">

                <?php get_back_link();
                echo $content; ?>

            </article>

        </div>

        <div class="row">
            <?php echo get_back_link(); ?>
        </div>
    </main>
</div>
</div>


<?php get_footer(); ?>