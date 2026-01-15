<?php
$term = get_queried_object();
if ($term && $term->taxonomy == "methodology_tag") {
    echo '<div class="text-block"><h2>' . $term->name . '</h2><div class="plain-text"> ' . $term->description . ' </div></div>';
} else {
    echo '<div class="empty-placeholder">Выберите элемент на дереве, чтобы прочитать о нём подробнее</div>';
}
?>