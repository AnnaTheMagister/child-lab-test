<?php
add_action('wp_enqueue_scripts', 'load_mindmap_assets');

function load_mindmap_assets()
{
    wp_enqueue_script('taggraphjs', get_theme_file_uri('inc/mindmap/tag-graph.js'), array('wp-element'), filemtime(get_template_directory() . ('/inc/mindmap/tag-graph.js')), true);
    wp_enqueue_script('mindmapjs', get_theme_file_uri('inc/mindmap/scripts.js'), array('wp-element'), filemtime(get_template_directory() . ('/inc/mindmap/scripts.js')), true);
    wp_set_script_translations('mindmapjs', 'childlab', get_template_directory() . '/language');
}

?>