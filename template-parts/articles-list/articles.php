<?php

$current_tag = get_methodology_tag();
$articles_count = get_articles_count();


if ($current_tag == '-1') {
    $posts = get_posts(array(
        'numberposts' =>$articles_count,
        'orderby' => 'date',
        'order' => 'ASC',
        'post_type' => 'article',

        'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
    ));
} else {

    $posts = get_posts(array(
        'numberposts' => $articles_count,
        'orderby' => 'date',
        'order' => 'ASC',
        'post_type' => 'article',
        'tax_query' => [
            [
                'taxonomy' => 'methodology_tag',
                'field' => 'id',
                'terms' => [$current_tag],
                'operator' => 'IN'
            ]
        ],
        'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
    ));
}
;

$posts_size = count($posts);
?>


<div class="container">
    <div class="childlab-widget">
        <header class="articles-list__header">
            <?php 
            if (isset($current_tag)&&(!($current_tag == '-1'))) {
                   $tag_name= "Тема :".get_term($current_tag)->name ;
            } else {
              
                  $tag_name="Все статьи";
               
            }
            echo $tag_name ?>

        </header>
        <?php foreach ($posts as $key => $post): ?>
            <?php setup_postdata($post); ?>
            <?php if ($key % 4 == 0): ?>
                <div class="row">
                <?php endif; ?>
                <div class="col-lg-3 col-md-6 col-sm-12">
                    <?php get_template_part('template-parts/articles-list/article-card'); ?>
                </div>
                <?php if ($key % 4 == 3 || $key == $posts_size - 1): ?>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>
        <div class="row">
            <?php

           if (((+$articles_count)<=$posts_size)) {
          
            ?>
            <a class="article-button" href="<?php echo get_site_url() ?>/?methodology=<?php echo $current_tag?>&articles_count=<?php
             $articles_count=''.(+$articles_count+5);
             echo $articles_count?>" >Показать еще</a>
             <?php
           }
           ?>
        </div>
    </div>

</div>

<?php
wp_reset_postdata(); // сброс
?>