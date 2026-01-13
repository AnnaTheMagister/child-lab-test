<?php
$author_term = get_queried_object();
$author_id = $author_term->term_id;

function get_author_description($author_id)
{
    $author_info = get_field('info', 'article_author_' . $author_id);
    if ($author_info) {
        $content = apply_filters('the_content', $author_info);
    }
    return $content ?? '-';
}
?>
<div class="container">
    <div class="childlab-widget author-details">
        <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-6 author-details__photo-container">
                <!-- Фото автора -->
                <?php
                $author_photo = get_article_author_image($author_term);
                if ($author_photo):
                    ?>

                    <div class="author-details__photo">
                        <img src="<?php echo esc_url($author_photo); ?>" alt="<?php echo esc_attr($name); ?>"
                            class="childlab-image" />
                    </div>
                <?php endif; ?>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-6">

                <!-- Имя и фамилия -->
                <h1 class="author-details__name">
                    <?php echo get_article_author_name($author_term); ?>
                </h1>

                <!-- Главная информация (bio) -->
                <?php
                $author_bio = get_field('bio', 'article_author_' . $author_id);
                if ($author_bio):
                    ?>
                    <div class="author-details__bio">
                        <?php echo esc_html($author_bio); ?>
                    </div>
                <?php endif; ?>


                <!-- Описание (info) -->
                <div class="d-lg-block d-md-none d-sm-none">
                    <div class="author-details__description">
                        <?php echo get_author_description($author_id); ?>
                    </div>
                </div>
            </div>

            <div class="d-lg-none">
                <div class="author-details__description">
                    <?php echo get_author_description($author_id); ?>
                </div>
            </div>
        </div>
    </div>
</div>