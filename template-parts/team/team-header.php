<?php
function get_post_by_slug($slug, $post_type = 'post')
{
    $args = array(
        'name' => $slug,
        'posts_per_page' => 1, // Only need one post
        'post_type' => $post_type,
        'post_status' => 'publish'
    );
    $posts = get_posts($args);

    if ($posts) {
        return $posts[0]; // Returns the first (and only) post object
    } else {
        return false; // No post found
    }
}
?>

<div>
    <?php
        $content = apply_filters('the_content', get_post_by_slug('team', 'page')->post_content);
        echo $content;
    ?>
</div>