<?php
// Получаем контент для построения TOC
$toc_content = display_article_content();
echo generate_table_of_contents(apply_filters('the_content', $toc_content));
?>