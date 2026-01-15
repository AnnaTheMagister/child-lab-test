<div>
    <?php
        $content = apply_filters('the_content', get_post_by_slug('team', 'page')->post_content);
        echo $content;
    ?>
</div>