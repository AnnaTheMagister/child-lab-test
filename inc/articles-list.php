<?php

session_start();

function set_methodology_tag($tag)
{

    $_SESSION['methodology_tag'] = $tag;
    return true;
}

function get_methodology_tag()
{
    return $_SESSION['methodology_tag'] ?? 'scientist_long'; // По умолчанию
}

// Обработчик смены режима через GET параметр
add_action('init', function () {
    if (isset($_GET['methodology_tag']) && !empty($_GET['methodology_tag'])) {
        $tag = sanitize_text_field($_GET['methodology_tag']);
        if (set_methodology_tag($tag)) {
            // Перенаправляем без GET параметра для чистоты URL
            wp_redirect('methodology_tag');
            exit;
        }
    }
});


?>