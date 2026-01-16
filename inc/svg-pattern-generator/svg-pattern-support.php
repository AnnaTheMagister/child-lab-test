<?php
add_action('wp_enqueue_scripts', 'load_svg_pattern_assets');

function load_svg_pattern_assets()
{
    wp_enqueue_script('svg_patternjs', get_theme_file_uri('inc/svg-pattern-generator/scripts.js'), array('wp-element'), '1.0', true);
    wp_enqueue_style('svg_patterncss', get_theme_file_uri('inc/svg-pattern-generator/styles.css'));
}

?>