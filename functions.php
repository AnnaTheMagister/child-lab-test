<?php
/**
 * ChildLab React Test Theme Functions
 *
 * @package childlab
 */

// ==============================================
// 1. Core Utilities (no WP dependencies)
// ==============================================
require_once get_template_directory() . '/inc/common.php';

// ==============================================
// 2. Session-Sensitive (must be before any output)
// ==============================================
require_once get_template_directory() . '/inc/reading-mode-support.php';

// ==============================================
// 3. Feature Support Modules (hooks + assets)
// ==============================================
require_once get_template_directory() . '/inc/toc/toc-support.php';
require_once get_template_directory() . '/inc/svg-pattern-generator/svg-pattern-support.php';
require_once get_template_directory() . '/inc/mindmap/mindmap-support.php';

// ==============================================
// 4. ACF Registrations (CPTs + taxonomies must load before fields)
// ==============================================
require_once get_template_directory() . '/inc/acf/register-article-fields.php';
require_once get_template_directory() . '/inc/acf/register-course-fields.php';
require_once get_template_directory() . '/inc/acf/register-project-fields.php';
require_once get_template_directory() . '/inc/acf/register-taxonomies.php';
require_once get_template_directory() . '/inc/acf/register-term-sorting.php';
require_once get_template_directory() . '/inc/acf/register-acf-fields.php';
require_once get_template_directory() . '/inc/acf/helpers.php';
require_once get_template_directory() . '/inc/lib/addColors.php';

// ==============================================
// 5. Data Helpers (pure functions, depend on CPTs being registered)
// ==============================================
require_once get_template_directory() . '/inc/article-data.php';
require_once get_template_directory() . '/inc/article-navigation.php';
require_once get_template_directory() . '/inc/articles-list.php';
require_once get_template_directory() . '/inc/author-data.php';

// ==============================================
// 6. Block Registration
// ==============================================
require_once get_template_directory() . '/inc/blocks/register-blocks.php';

// ==============================================
// 7. Kadence Blocks Wrappers (scoped styles)
// ==============================================
/**
 * Wrap Kadence Testimonials blocks in a scoped container
 * to avoid CSS specificity conflicts.
 */
add_filter( 'render_block', function ( $block_content, $block ) {
	if ( isset( $block['blockName'] ) && str_contains( $block['blockName'], 'kadence/testimonials' ) ) {
		$block_content = '<div class="childlab-testimonials">' . $block_content . '</div>';
	}
	return $block_content;
}, 10, 2 );

// ==============================================
// 8. Theme Setup
// ==============================================
/**
 * Register theme support features.
 */
function childlab_add_support() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'menus' );
	add_theme_support( 'custom-logo' );
}
add_action( 'after_setup_theme', 'childlab_add_support' );

/**
 * Auto-create required pages if they don't exist.
 * Runs on theme activation and admin init for fresh installs.
 */
function childlab_ensure_required_pages() {
	$pages = array(
		// 'courses'  => __( 'Курсы', 'childlab' ),
		'articles' => __( 'Статьи', 'childlab' ),
		'projects' => __( 'Проекты', 'childlab' ),
		// 'authors'  => __( 'Авторы', 'childlab' ),
	);

	foreach ( $pages as $slug => $title ) {
		$existing = get_posts( array(
			'name'           => $slug,
			'post_type'      => 'page',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
		) );

		if ( empty( $existing ) ) {
			wp_insert_post( array(
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_content' => '',
			) );
		}
	}
}
add_action( 'after_switch_theme', 'childlab_ensure_required_pages' );
add_action( 'admin_init', 'childlab_ensure_required_pages' );

/**
 * Load text domain for translations.
 */
add_action( 'after_setup_theme', function () {
	load_theme_textdomain( 'childlab', get_template_directory() . '/language' );
} );

// ==============================================
// 9. Default Images
// ==============================================
$GLOBALS['default_image']          = get_template_directory_uri() . '/assets/images/post-bg.jpg';
$GLOBALS['unknown_user_image']     = get_template_directory_uri() . '/assets/images/unknown_user.png';
$GLOBALS['default_projects_image'] = get_template_directory_uri() . '/assets/images/default-projects.jpg';

// ==============================================
// 10. Asset Loading
// ==============================================
/**
 * Enqueue all theme styles and scripts.
 */
function childlab_load_assets() {
	// --- Styles ---
	wp_enqueue_style(
		'childlab-css-variables',
		get_theme_file_uri( '/assets/styles/variables.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/variables.css' )
	);
	wp_enqueue_style(
		'childlab-css-common',
		get_theme_file_uri( '/assets/styles/common.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/common.css' )
	);
	wp_enqueue_style(
		'childlab-css-header',
		get_theme_file_uri( '/assets/styles/header.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/header.css' )
	);
	wp_enqueue_style(
		'childlab-css-single-article',
		get_theme_file_uri( '/assets/styles/single-article.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/single-article.css' )
	);
	wp_enqueue_style(
		'childlab-css-article-card',
		get_theme_file_uri( '/assets/styles/article-card.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/article-card.css' )
	);
	wp_enqueue_style(
		'childlab-css-switchers',
		get_theme_file_uri( '/assets/styles/switchers.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/switchers.css' )
	);
	wp_enqueue_style(
		'childlab-css-team',
		get_theme_file_uri( '/assets/styles/team.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/team.css' )
	);
	wp_enqueue_style(
		'childlab-css-methodology-tags',
		get_theme_file_uri( '/assets/styles/methodology-tags.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/methodology-tags.css' )
	);
	wp_enqueue_style(
		'childlab-css-projects',
		get_theme_file_uri( '/assets/styles/projects.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/projects.css' )
	);
	wp_enqueue_style(
		'childlab-css-kadence-testimonials',
		get_theme_file_uri( '/assets/styles/kadence-testimonials.css' ),
		array(),
		filemtime( get_template_directory() . '/assets/styles/kadence-testimonials.css' )
	);

	// Build output (wp-scripts)
	wp_enqueue_style(
		'childlab-css-build',
		get_theme_file_uri( '/build/index.css' ),
		array(),
		filemtime( get_template_directory() . '/build/index.css' )
	);

	// --- Scripts ---
	wp_enqueue_script(
		'childlab-js-header',
		get_theme_file_uri( '/assets/scripts/header.js' ),
		array( 'wp-element' ),
		filemtime( get_template_directory() . '/assets/scripts/header.js' ),
		true
	);
	wp_enqueue_script(
		'childlab-js-main',
		get_theme_file_uri( '/build/index.js' ),
		array( 'wp-element', 'wp-i18n' ),
		filemtime( get_template_directory() . '/build/index.js' ),
		true
	);

	// JS translations for React components
	wp_set_script_translations( 'childlab-js-main', 'childlab', get_template_directory() . '/language/js' );

	// Data bridge for React — localized JS object
	wp_localize_script( 'childlab-js-main', 'themeData', array(
		'templateUrl' => get_template_directory_uri(),
	) );
}
add_action( 'wp_enqueue_scripts', 'childlab_load_assets' );

// ==============================================
// 11. Shortcodes
// ==============================================
/**
 * Register shortcodes for various components.
 */
function childlab_add_shortcodes() {
	add_shortcode('methodology_tags_menu', 'childlab_methodology_tags_menu_shortcode');
	add_shortcode('articles_list', 'childlab_articles_list_shortcode');
}
add_action('init', 'childlab_add_shortcodes');

/**
 * Shortcode for methodology tags menu.
 */
function childlab_methodology_tags_menu_shortcode() {
	// Включаем буферизацию вывода, чтобы захватить содержимое компонента
	ob_start();
	
	// Подключаем шаблон
	require get_template_directory() . '/template-parts/articles-list/methodology-tags-menu.php';
	
	// Получаем содержимое и очищаем буфер
	$content = ob_get_clean();
	
	return $content;
}

/**
 * Shortcode for articles list.
 */
function childlab_articles_list_shortcode() {
	// Включаем буферизацию вывода, чтобы захватить содержимое компонента
	ob_start();
	
	// Подключаем шаблон
	require get_template_directory() . '/template-parts/articles-list/articles.php';
	
	// Получаем содержимое и очищаем буфер
	$content = ob_get_clean();
	
	return $content;
}

/**
 * Enqueue Google Fonts (Lora).
 */
function childlab_enqueue_lora_font() {
	wp_enqueue_style(
		'childlab-font-lora',
		'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap'
	);
}
add_action( 'wp_enqueue_scripts', 'childlab_enqueue_lora_font' );
