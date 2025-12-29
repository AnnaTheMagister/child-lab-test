<?php

session_start();

function set_reading_mode($mode) {
    if (in_array($mode, ['scientist_long', 'scientist_short', 'parent_long', 'parent_short'])) {
        $_SESSION['reading_mode'] = $mode;
        return true;
    }
    return false;
}

function get_reading_mode() {
    return $_SESSION['reading_mode'] ?? 'scientist_long'; // По умолчанию
}

// Обработчик смены режима через GET параметр
add_action('init', function() {
    if (isset($_GET['reading_mode']) && !empty($_GET['reading_mode'])) {
        $mode = sanitize_text_field($_GET['reading_mode']);
        if (set_reading_mode($mode)) {
            // Перенаправляем без GET параметра для чистоты URL
            wp_redirect(remove_query_arg('reading_mode'));
            exit;
        }
    }
});


?>