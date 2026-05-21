<?php

// Register all ACF field groups - this file ensures that all field group files are loaded
function register_all_acf_field_groups() {
    // Load the course fields directly to ensure they're available
    // This is a fallback method to make sure course fields are always included
    $course_fields_file = get_template_directory() . '/inc/acf/register-course-fields.php';
    if (file_exists($course_fields_file)) {
        require_once $course_fields_file;
    }
}

// Load field groups directly when ACF is active
if (function_exists('acf_add_local_field_group')) {
    register_all_acf_field_groups();
}

// Also add hook for ACF to ensure field groups are loaded properly
add_action('acf/include_fields', 'register_all_acf_field_groups');