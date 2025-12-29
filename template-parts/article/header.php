<?php
// Заголовок статьи с подзаголовком из ACF
$subtitle = get_field('subtitle');
?>

<header class="container">
    <div class="row">
        <div class="col-3">
            Пердыдущая статья
        </div>
        <div class="col-6">
            <!-- Основной заголовок -->
            <h1 class="article-title">
                <?php the_title(); ?>
            </h1>
            <h2>
                <?php the_excerpt(); ?>
            </h2>
            <div>
                <?php the_author(); ?>
            </div>
        </div>
        <div class="col-3">
            Следующая статья
        </div>
    </div>
</header>