<?php
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
?>