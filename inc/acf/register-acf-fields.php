<?php
/**
 * ACF Field Group Loader
 *
 * Ensures all field group definition files are loaded.
 * Each field group file self-registers via both direct acf_add_local_field_group()
 * and acf/include_fields hook.
 *
 * @package childlab
 */

// Load all field group definitions.
require_once get_template_directory() . '/inc/acf/field-groups/article-fields.php';
require_once get_template_directory() . '/inc/acf/field-groups/author-fields.php';
require_once get_template_directory() . '/inc/acf/field-groups/projects-fields.php';
require_once get_template_directory() . '/inc/acf/field-groups/methodology-tag-fields.php';
