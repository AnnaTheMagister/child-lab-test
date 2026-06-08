<?php
/**
 * Register Gutenberg blocks and custom category.
 *
 * @package childlab
 */

add_filter('block_categories_all', function ($categories) {
    $categories[] = [
        'slug'  => 'childlab',
        'title' => __('Childlab', 'childlab'),
    ];
    return $categories;
});

add_action('init', function () {
    $build_dir = get_template_directory() . '/build';
    if (!is_dir($build_dir)) {
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($build_dir, FilesystemIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if ($file->getFilename() !== 'block.json') {
            continue;
        }
        register_block_type($file->getPath());
    }
});
