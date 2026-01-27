<div class="container">
    <div class="childlab-widget methodology row">
        <?php $term_data = get_methodology_data_for_page(); ?>
        <?php $empty_placeholder = '<div class="empty-placeholder">Выберите элемент на дереве, чтобы прочитать о нём подробнее</div>'; ?>
        <?php if (!$term_data): ?>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 order-xs-2 order-sm-2 order-md-2 order-lg-1">
                <div class="methodology__header">
                    <?php
                    $content = apply_filters('the_content', get_post_by_slug('методология', 'page')->post_content);
                    echo $content;
                    ?>
                    <div class="d-xs-block d-sm-block d-md-block d-lg-none">
                        <?php echo $empty_placeholder ?>
                    </div>
                </div>
            </div>
        <?php endif; ?>
        <div class="col-lg-7 col-md-12 col-sm-12 col-xs-12 order-xs-1 order-sm-1 order-md-1 order-lg-2">
            <div class="methodology__tree-wrapper">
                <div class="methodology__tree">
                    <img class="methodology__tree-image"
                        src="<?php echo get_template_directory_uri() . '/assets/images/tree.png' ?>" alt="tree" />
                    <div id="graph" class="methodology__graph-container"></div>
                </div>
            </div>
        </div>

        <?php if (!$term_data): ?>
            <div class="col-lg-5 col-md-12 col-sm-12 col-xs-12 order-xs-3 order-sm-3 order-md-3 order-lg-3">
                <div class="childlab-widget methodology__description">
                    <?php get_template_part('template-parts/methodology/tag-description'); ?>
                </div>
            </div>
        <?php endif; ?>
        <?php if ($term_data): ?>
            <div
                class="col-lg-5 col-md-12 col-sm-12 col-xs-12 order-xs-3 order-sm-3 order-md-3 order-lg-3 d-xs-none d-sm-none d-md-none d-lg-block d-xlg-block">
                <div class="childlab-widget methodology__description">
                    <?php echo $empty_placeholder ?>
                </div>
            </div>
        <?php endif; ?>



    </div>
    <?php $term = get_methodology_data_for_page();
    if ($term && $term->term_id) {
        echo get_articles_list_by_taxonomy('methodology_tag', $term->term_id, "Статьи по теме");
    }
    ?>
</div>