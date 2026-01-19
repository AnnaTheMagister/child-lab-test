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

function get_methodology_data_for_page()
{
    $term = get_queried_object();

    if ($term->post_type === 'page') {

        $meta_slug = get_methodology_tag();
        return get_term_by('slug', sanitize_text_field($meta_slug), 'methodology_tag');
    } else {
        return $term;
    }
}
?>