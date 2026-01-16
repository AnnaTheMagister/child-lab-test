<?php
add_action('wp_enqueue_scripts', 'load_mindmap_assets');

function load_mindmap_assets()
{
    wp_enqueue_script('taggraphjs', get_theme_file_uri('inc/mindmap/tag-graph.js'), array('wp-element'), '1.0', true);
    wp_enqueue_script('mindmapjs', get_theme_file_uri('inc/mindmap/scripts.js'), array('wp-element'), '1.0', true);
    wp_enqueue_style('mindpamcss', get_theme_file_uri('inc/mindmap/styles.css'));
}

?>