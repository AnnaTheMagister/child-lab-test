<div class="container">
    <div class="childlab-widget methodology">
        <div class="methodology__header">
            <?php
            $content = apply_filters('the_content', get_post_by_slug('methodology', 'page')->post_content);
            echo $content;
            ?>
        </div>
        <div class="row">
            <div class="col-lg-7">
                <div class="methodology__tree-wrapper">
                    <?php get_template_part('template-parts/methodology/tags-graph'); ?>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="childlab-widget">
                    <?php get_template_part('template-parts/methodology/tag-description'); ?>
                </div>
            </div>
        </div>

    </div>
    <?php $term = get_queried_object();
    if ($term && $term->taxonomy == "methodology_tag") {
        echo get_articles_list_by_taxonomy('methodology_tag', $term->term_id, "Статьи по теме");
    }
    ?>
</div>