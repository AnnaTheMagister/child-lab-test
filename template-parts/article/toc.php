<?php
// Получаем контент для построения TOC
$toc_content = get_field('for_scientist_long') ?: get_the_content();
echo generate_table_of_contents(apply_filters('the_content', $toc_content));
?>