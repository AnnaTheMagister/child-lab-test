<?php $page_data = get_post_by_slug('methodology', 'page'); ?>

<div id="methodology-tree-component"></div>


<div class="container mt-3">
    <div class="childlab-widget">
        <?php
        $content = apply_filters('the_content', get_the_content($page_data->ID));
        echo $content;
        ?>
    </div>
</div>