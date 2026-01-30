<?php $page_data = get_post_by_slug('methodology', 'page'); ?>
<div class="container">
    <div class="childlab-widget methodology">
        <div class="row">
            <?php $term_data = get_methodology_data_for_page(); ?>
            <?php $empty_placeholder = '<div class="empty-placeholder">' . esc_html__('Выберите элемент на дереве, чтобы прочитать о нём подробнее', 'childlab') . '</div>'; ?>

            <div
                class="col-lg-12 col-md-12  order-md-2 order-lg-1 d-sm-none s-xs-none d-md-block d-lg-block d-xlg-block d-xxlg-block">
                <div class="methodology__header">
                    <h1><?php esc_html_e("Методология", "childlab") ?></h1>
                    <p><?php esc_html_e('Наша методология «дерева» отражает то, что способности не появляются сами по себе — они вырастают из отношений и активной деятельности ребёнка', 'childlab') ?>
                    </p>
                </div>
            </div>

            <?php if (!$term_data): ?>
                <div
                    class="col-sm-12 col-xs-12  order-sm-2 order-xs-2 d-sm-block s-xs-block d-md-none d-lg-none d-xlg-none d-xxlg-none">
                    <div class="methodology__header">
                        <h1><?php esc_html_e("Методология", "childlab") ?></h1>
                        <p><?php esc_html_e('Наша методология «дерева» отражает то, что способности не появляются сами по себе — они вырастают из отношений и активной деятельности ребёнка', 'childlab') ?>
                        </p>


                        <?php echo $empty_placeholder ?>
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
                <div
                    class="col-lg-5 col-md-12 col-sm-12 col-xs-12 order-lg-4 order-xlg-4 order-xxlg-4 d-xs-none d-sm-none d-md-none d-lg-block d-xlg-block d-xxlg-block">
                    <div class="childlab-widget methodology__description">
                        <?php echo $empty_placeholder ?>
                    </div>
                </div>
            <?php endif; ?>
            <?php if ($term_data): ?>
                <div class="col-lg-5 col-md-12 col-sm-12 col-xs-12 order-xs-3 order-sm-3 order-md-3 order-lg-3">


                    <?php $term = get_methodology_data_for_page();

                    if ($term && $term->term_id) {
                        echo get_articles_list_by_taxonomy('methodology_tag', $term->term_id, esc_html__("Статьи по теме", 'childlab'));
                    }
                    ?>


                </div>
            <?php endif; ?>

        </div>
    </div>

</div>


<div class="container mt-3">
    <div class="childlab-widget">
        <?php
        $content = apply_filters('the_content', get_the_content($page_data->ID));
        echo $content;
        ?>
    </div>
</div>