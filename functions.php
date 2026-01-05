<?php

require_once get_template_directory() . '/inc/example.php';
require_once get_template_directory() . '/inc/reading-mode-support.php';
require_once get_template_directory() . '/inc/acf/register-article-fields.php';


function boilerplate_load_assets()
{
  wp_enqueue_style('cssvariables', get_theme_file_uri('/assets/styles/variables.css'));
  wp_enqueue_script('ourmainjs', get_theme_file_uri('/build/index.js'), array('wp-element'), '1.0', true);
  wp_enqueue_style('ourmaincss', get_theme_file_uri('/build/index.css'));
   wp_enqueue_style('ourarticlecss', get_theme_file_uri('/assets/styles/articles-list.css'));
}

add_action('wp_enqueue_scripts', 'boilerplate_load_assets');


require_once get_template_directory() . '/inc/toc/toc-support.php';

function boilerplate_add_support()
{
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('menus');
  add_theme_support('custom-logo');
}

add_action('after_setup_theme', 'boilerplate_add_support');


