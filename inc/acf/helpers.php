<?php

// Helper functions for ACF fields and general functionality

function get_theme_images_list()
{
    $images = array();
    $theme_images_dir = get_template_directory() . '/assets/images/svg-patterns/';
    $theme_images_url = get_template_directory_uri() . '/assets/images/svg-patterns/';

    // Создаем папку, если её нет
    if (!file_exists($theme_images_dir)) {
        wp_mkdir_p($theme_images_dir);
    }

    // Сканируем папку
    $allowed_extensions = array('svg');

    if (is_dir($theme_images_dir)) {
        $files = scandir($theme_images_dir);

        foreach ($files as $file) {
            $file_path = $theme_images_dir . $file;
            $extension = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));

            if (in_array($extension, $allowed_extensions)) {
                $images[$theme_images_url . $file] = $file;
            }
        }
    }

    return $images;
}

// AJAX handlers
add_action('wp_ajax_get_methodology_tags', 'ajax_get_methodology_tags');
add_action('wp_ajax_nopriv_get_methodology_tags', 'ajax_get_methodology_tags');

function ajax_get_methodology_tags()
{
    $args = array(
        'taxonomy' => 'methodology_tag',
        'hide_empty' => false,
        'meta_key' => 'order',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
    );

    $terms = get_terms($args);
    $result = array();

    foreach ($terms as $term) {
        $acf_fields = get_fields('methodology_tag_' . $term->term_id);
        $result[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
            'count' => $term->count,
            'order' => $acf_fields['order'] ?? 0,
            'color' => $acf_fields['color'] ?? '#FF0000',
            'svg_pattern' => $acf_fields['svg_pattern'] ?? '',
        );
    }

    wp_send_json_success($result);
    wp_die();
}

// AJAX обработчик для получения авторов статей
add_action('wp_ajax_get_article_authors', 'ajax_get_article_authors');
add_action('wp_ajax_nopriv_get_article_authors', 'ajax_get_article_authors');

function ajax_get_article_authors()
{
    $args = array(
        'taxonomy' => 'article_author',
        'hide_empty' => false,
    );

    $terms = get_terms($args);
    $result = array();

    foreach ($terms as $term) {
        $acf_fields = get_fields('article_author_' . $term->term_id);
        $result[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
            'description' => $term->description,
            'count' => $term->count,
            'first_name' => $acf_fields['first_name'] ?? '',
            'last_name' => $acf_fields['last_name'] ?? '',
            'photo' => $acf_fields['photo'] ?? '',
            'bio' => $acf_fields['bio'] ?? '',
            'info' => $acf_fields['info'] ?? '',
        );
    }

    wp_send_json_success($result);
    wp_die();
}

// REST API support for custom fields (moved here to keep it clean)
add_action('rest_api_init', function () {
    // Включаем метаданные в REST API для всех кастомных типов постов и таксономий
    register_rest_field('article', 'acf', array(
        'get_callback' => function ($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));

    register_rest_field('projects', 'acf', array(
        'get_callback' => function ($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));

    register_rest_field('courses', 'acf', array(
        'get_callback' => function ($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));

    register_rest_field('article_author', 'acf', array(
        'get_callback' => function ($term) {
            return get_fields('article_author_' . $term['id']);
        },
        'schema' => null,
    ));

    register_rest_field('methodology_tag', 'acf', array(
        'get_callback' => function ($term) {
            return get_fields('methodology_tag_' . $term['id']);
        },
        'schema' => null,
    ));
});