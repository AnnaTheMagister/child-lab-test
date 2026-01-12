<?php

require_once get_template_directory() . '/inc/example.php';
require_once get_template_directory() . '/inc/reading-mode-support.php';
require_once get_template_directory() . '/inc/acf/register-article-fields.php';


function boilerplate_load_assets()
{
  wp_enqueue_style('cssvariables', get_theme_file_uri('/assets/styles/variables.css'));
  wp_enqueue_style('csscommon', get_theme_file_uri('/assets/styles/common.css'));
  wp_enqueue_style('csssinglearticle', get_theme_file_uri('/assets/styles/single-article.css'));
  wp_enqueue_style('cssarticlecard', get_theme_file_uri('/assets/styles/article-card.css'));
  wp_enqueue_script('ourmainjs', get_theme_file_uri('/build/index.js'), array('wp-element'), '1.0', true);
  wp_enqueue_style('ourmaincss', get_theme_file_uri('/build/index.css'));
  // wp_enqueue_style('ourarticlecss', get_theme_file_uri('/assets/styles/articles-list.css'));
  wp_enqueue_style('ourarticleswitcherscss', get_theme_file_uri('/assets/styles/switchers.css'));
  wp_enqueue_style('teamcss', get_theme_file_uri('/assets/styles/team.css'));
  wp_enqueue_style('methodologytagscss', get_theme_file_uri('/assets/styles/methodology-tags.css'));
  wp_enqueue_style('projectscss', get_theme_file_uri('/assets/styles/projects.css'));
  // подключение библиотечки для svg
  wp_enqueue_style('svgscss', get_theme_file_uri('/inc/svg-pattern-generator/styles.css'));
  wp_enqueue_script('svgjs', get_theme_file_uri('/inc/svg-pattern-generator/scripts.js'), array('wp-element'), '1.0', true);
}

add_action('wp_enqueue_scripts', 'boilerplate_load_assets');


require_once get_template_directory() . '/inc/toc/toc-support.php';
require_once get_template_directory() . '/inc/article-navigation.php';
require_once get_template_directory() . '/inc/article-data.php';
require_once get_template_directory() . '/inc/articles-list.php';

function boilerplate_add_support()
{
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('menus');
  add_theme_support('custom-logo');
}

add_action('after_setup_theme', 'boilerplate_add_support');



$GLOBALS['default_image'] = get_template_directory_uri() . '/assets/images/default-image.jfif';
$GLOBALS['unknown_user_image'] = get_template_directory_uri() . '/assets/images/unknown_user.png';