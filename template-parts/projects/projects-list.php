<?php

$posts = get_posts(array(
    'numberposts' => -1,
    'orderby' => 'date',
    'order' => 'ASC',
    'post_type' => 'projects',
    'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
));
?>
<div class="projects-list">

    <?php
    foreach ($posts as $key => $post) {
        setup_postdata($post);

        ?>

        <div class="childlab-widget project" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">
            <h2 class="project-title"><?php the_title(); ?></h2>

            <div class="project-description truncate-multiline"><?php the_content(); ?></div>
            <a class="project-link" href="<?php the_permalink(  );?>">Подробнее</a>
        </div>
   


    <?php
    wp_reset_postdata(); // сброс
    ?>

<?php } ?>


</div>