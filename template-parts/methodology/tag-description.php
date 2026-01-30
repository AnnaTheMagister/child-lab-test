<?php
$term_data = get_methodology_data_for_page();

$empty_placeholder = '<div class="empty-placeholder">' . esc_html__('Выберите элемент на дереве, чтобы прочитать о нём подробнее', 'childlab') . '</div>';

if ($term_data) {
    if (empty($term_data) && !is_wp_error($term_data)) {
        echo $empty_placeholder;
    } else {
        echo '<h2>' . $term_data->name . '</h2>';
        echo '<p class="methodology__description-text">' . $term_data->description . '</p>';
    }
} else {
    echo $empty_placeholder;
}
?>