<?php
// Text domain for courses
function add_courses_text_domain() {
    load_theme_textdomain('childlab', get_template_directory() . '/language');
}
add_action('after_setup_theme', 'add_courses_text_domain');

// Add the English translations
add_action('init', function() {
    load_theme_textdomain('childlab', get_template_directory() . '/language');
});
?>