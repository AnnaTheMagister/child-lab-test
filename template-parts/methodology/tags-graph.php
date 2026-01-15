<?php
$tags = get_terms(array('taxonomy' => 'methodology_tag', 'hide_empty' => false));
if ($tags && !is_wp_error($tags)) {
    foreach ($tags as $tag) {

        echo '<div><a href="' . get_term_link($tag) . '">' . $tag->name . '</a></div>';
    }
}
?>