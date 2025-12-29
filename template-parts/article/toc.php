<?php
// Автоматическое оглавление из заголовков h2 и h3
function generate_table_of_contents($content) {
    preg_match_all('/<h([2-3])([^>]*)id="([^"]+)"[^>]*>(.*?)<\/h[2-3]>/i', $content, $matches, PREG_SET_ORDER);
    
    if (empty($matches)) {
        return '<div class="toc-empty">В этой статье нет разделов</div>';
    }
    
    $toc = '<nav class="table-of-contents" aria-label="Оглавление">';
    $toc .= '<h4 class="toc-title">📑 Содержание</h4>';
    $toc .= '<ul class="toc-list">';
    
    $current_h2 = null;
    
    foreach ($matches as $match) {
        $level = $match[1];
        $id = $match[3];
        $text = strip_tags($match[4]);
        
        if ($level == 2) {
            // Основной раздел (h2)
            $toc .= '<li class="toc-item toc-h2">';
            $toc .= '<a href="#' . $id . '" class="toc-link">' . $text . '</a>';
            $toc .= '</li>';
            $current_h2 = $id;
        } elseif ($level == 3 && $current_h2) {
            // Подраздел (h3)
            $toc .= '<li class="toc-item toc-h3">';
            $toc .= '<a href="#' . $id . '" class="toc-link">' . $text . '</a>';
            $toc .= '</li>';
        }
    }
    
    $toc .= '</ul>';
    $toc .= '</nav>';
    
    return $toc;
}

// Получаем контент для построения TOC
$toc_content = get_field('for_scientist_long') ?: get_the_content();
echo generate_table_of_contents(apply_filters('the_content', $toc_content));
?>