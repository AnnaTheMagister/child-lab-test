<?php get_header(); ?>

<div class="container">
<?php the_content() ?>
</div>

<?php
get_template_part('template-parts/articles-list/methodology-tags-menu');
get_template_part('template-parts/articles-list/articles');
?>


<?php
get_footer();
?>