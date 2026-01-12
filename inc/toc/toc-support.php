<?php

add_action('wp_enqueue_scripts', 'load_toc_assets');

function load_toc_assets()
{
    wp_enqueue_script('tocjs', get_theme_file_uri('inc/toc/toc.js'), array('wp-element'), '1.0', true);
    wp_enqueue_style('toccss', get_theme_file_uri('inc/toc/toc.css'));
}

// Функция для поика заголовков по регулярке
function get_headings_match($content)
{
    preg_match_all('/<h([2-6])([^>]*)>(.*?)<\/h[2-6]>/i', $content, $matches, PREG_SET_ORDER);
    return $matches;
}

// Функция для добавления ID к заголовкам
function add_anchor_ids_to_headings($content)
{
    $matches = get_headings_match($content);

    if (empty($matches)) {
        return $content;
    }

    foreach ($matches as $index => $match) {

        $level = $match[1];
        $attrs = $match[2];
        $text = strip_tags($match[3]);

        // Создаем уникальный ID
        $anchor_id = 'section-' . sanitize_title($text) . '-' . $index;

        // Заменяем заголовок
        $new_heading = '<h' . $level . ' id="' . $anchor_id . '"' . $attrs . '>' . $match[3] . '</h' . $level . '>';

        $content = str_replace($match[0], $new_heading, $content);
    }

    return $content;
}


// Автоматическое оглавление из заголовков h2 - h6
function generate_table_of_contents($content)
{
    $matches = get_headings_match($content);
    $toc = '<nav class="table-of-contents" aria-label="Содержание">';

    if (empty($matches)) {
        return $toc . '<div class="toc-empty">В этой статье нет разделов</div></nav>';
    }


    $toc .= '<h4 class="toc-title">Содержание</h4>';

    $current_level = null;
    foreach ($matches as $index => $match) {
        $level = $match[1];
        $text = strip_tags($match[3]);

        // Создаем уникальный ID
        $anchor_id = 'section-' . sanitize_title($text) . '-' . $index;

        if ($current_level == null || $current_level < $level) {
            $toc .= '<ul class="toc-list toc-h' . $level . ($current_level ? " toc-nested" : "") . '">';
        } else if ($current_level > $level) {
            $toc .= '</ul>';
        }

        $current_level = $level;

        $toc .= '<li class="toc-item">';
        $toc .= '<a href="#' . $anchor_id . '" class="toc-link">' . $text . '</a>';
        $toc .= '</li>';
    }

    $toc .= '</ul>';
    $toc .= '</nav>';

    return $toc;
}
?>