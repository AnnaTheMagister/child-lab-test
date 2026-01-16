<?php
$term_data = get_methodology_data_for_page();

$empty_placeholder = '<div class="empty-placeholder">Выберите элемент на дереве, чтобы прочитать о нём подробнее</div>';

if ($term_data) {
    if (empty($term_data) && !is_wp_error($term_data)) {
        echo $empty_placeholder;
    } else {
        echo '<h2>' . $term_data->name . '</h2>';
        echo '<div>' . $term_data->description . '</div>';
    }
} else {
    echo $empty_placeholder;
}
?>