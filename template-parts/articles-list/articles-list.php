<?php

$posts = get_posts(array(
    'numberposts' => -1,
    'orderby' => 'date',
    'order' => 'ASC',
    'post_type' => 'article',
    'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
));
$posts_size = count($posts);
?>

<div class="articles">
    <div class="articles-header">
        <h3>Все статьи</h3>
        <button class="articles-button">Сбросить</button>
    </div>
    <div class="row">
        <?php



        foreach ($posts as $key => $post) {
            setup_postdata($post);

            ?>
            <div class="col-lg-3"><?php the_title(); ?></div>

            <?php

            get_template_part('template-parts/article/meta');

            $tags = get_the_terms($post->id, 'methodology_tag');
            //print_r(value: $tags);
            if ($tags) {
                $terms = get_term_meta($tags[0]->term_id);
            }

            if ($key == '1') {
                ?>
                <div class="article-card-big">
                    <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">

                        <div class="article-tag" style="background-color:<?php if (!empty($terms)) {
                            echo $terms['color'][0];
                        } ?>">
                            <?php if (!empty($tags)) {
                                echo $tags[0]->name;
                            } ?>
                        </div>
                    </div>
                    <div class="article-details">

                        <div class="article-authors">
                            <div class="article-avatars"><?php
                            $avatars = get_field('authors');
                            if (!empty($avatars)) {
                                foreach ($avatars as $avatar) {

                                    ?><img src="/<?php echo $avatar['user_avatar']; ?>" class="article-avatar-img" /><?php }
                            } ?>
                            </div>
                            <div class="article-author-text">
                                <?php
                                $avatars = get_field('authors');
                                if (!empty($avatars)) {
                                    foreach ($avatars as $avatar) {

                                        echo (' ' . $avatar['display_name']);
                                    }
                                } ?> · <?php the_date(); ?>
                            </div>

                        </div>
                        <div class="article-card-big-text ">
                            <h2><?php the_title(); ?></h2>
                        </div>
                        <div class="article-card-big-text">
                            <?php the_excerpt(); ?>
                        </div>
                        <div class="article-card-big-text">
                            <p><?php the_content(); ?></p>
                        </div>
                    </div>
                </div>

                <!-- </td> -->
                <?php
            }
            if ($key == '2') {

                ?>

                <div class="artics-column">

                    <div class="article-card-smoll">

                        <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">

                            <div class="article-tag" style="background-color:<?php if (!empty($terms)) {
                                echo $terms['color'][0];
                            } ?>">
                                <?php if (!empty($tags)) {
                                    echo $tags[0]->name;
                                } ?>
                            </div>
                        </div>
                        <div class="article-details">
                            <div class="article-meta childlab-text childlab-text__meta">
                                <div class="article-meta__authors">
                                    <div class="childlab-avatars">
                                        <?php $avatars = get_field('authors');
                                        if (!empty($avatars)) {
                                            foreach ($avatars as $avatar) {

                                                ?><img src="/<?php echo $avatar['user_avatar']; ?>"
                                                    class="childlab-avatar" />
                                            <?php }
                                        } ?>
                                    </div>
                                    <div class="article-meta__authors-names"><?php
                                    $avatars = get_field('authors');
                                    if (!empty($avatars)) {
                                        foreach ($avatars as $avatar) {

                                            echo (' ' . $avatar['display_name']);
                                        }
                                    }
                                    ?>

                                    </div>
                                </div> · <?php the_date(); ?>
                            </div>

                        </div>
                        <div class="childlab-text childlab-text__title">
                            <?php the_title(); ?>
                        </div>
                        <div class="childlab-text childlab-text__subtitle">
                            <?php the_excerpt(); ?>
                        </div>
                        <div class="childlab-text childlab-text__excerpt">
                            <?php the_content(); ?>
                        </div>


                    </div>


                    <?php
            }
            if ($key == '3') {



                ?>



                    <div class="article-card-smoll">


                        <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">

                            <div class="article-tag" style="background-color:<?php if (!empty($terms)) {
                                echo $terms['color'][0];
                            } ?>">
                                <?php if (!empty($tags)) {
                                    echo $tags[0]->name;
                                } ?>
                            </div>
                        </div>
                        <div class="article-details">
                            <div class="article-meta childlab-text childlab-text__meta">
                                <div class="article-meta__authors">
                                    <div class="childlab-avatars">
                                        <?php
                                        $avatars = get_field('authors');
                                        if (!empty($avatars)) {
                                            foreach ($avatars as $avatar) {

                                                ?><img src="/<?php echo $avatar['user_avatar']; ?>"
                                                    class="childlab-avatar" />
                                            <?php }
                                        } ?>
                                    </div>
                                    <div class="article-meta__authors-names"><?php
                                    $avatars = get_field('authors');
                                    if (!empty($avatars)) {
                                        foreach ($avatars as $avatar) {

                                            echo (' ' . $avatar['display_name']);
                                        }
                                    }
                                    ?>

                                    </div>
                                </div> · <?php the_date(); ?>
                            </div>
                            <div class="childlab-text childlab-text__title">
                                <?php the_title(); ?>
                            </div>
                            <div class="childlab-text childlab-text__subtitle">
                                <?php the_excerpt(); ?>
                            </div>
                            <div class="childlab-text childlab-text__excerpt">
                                <?php the_content(); ?>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- </td> -->
                <?php
            }
            if ($key == '4') {




                ?>

                <div class="artics-column">

                    <div class="article-card-smoll">


                        <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">

                            <div class="article-tag" style="background-color:<?php if (!empty($terms)) {
                                echo $terms['color'][0];
                            } ?>">
                                <?php if (!empty($tags)) {
                                    echo $tags[0]->name;
                                } ?>
                            </div>
                        </div>
                        <div class="article-details">
                            <div class="article-meta childlab-text childlab-text__meta">
                                <div class="article-meta__authors">
                                    <div class="childlab-avatars">
                                        <?php
                                        $avatars = get_field('authors');
                                        if (!empty($avatars)) {
                                            foreach ($avatars as $avatar) {

                                                ?><img src="/<?php echo $avatar['user_avatar']; ?>"
                                                    class="childlab-avatar" />
                                            <?php }
                                        } ?>
                                    </div>
                                    <div class="article-meta__authors-names"><?php
                                    $avatars = get_field('authors');
                                    if (!empty($avatars)) {
                                        foreach ($avatars as $avatar) {

                                            echo (' ' . $avatar['display_name']);
                                        }
                                    }
                                    ?>

                                    </div>
                                </div> · <?php the_date(); ?>
                            </div>
                            <div class="childlab-text childlab-text__title">
                                <?php the_title(); ?>
                            </div>
                            <div class="childlab-text childlab-text__subtitle">
                                <?php the_excerpt(); ?>
                            </div>
                            <div class="childlab-text childlab-text__excerpt">
                                <?php the_content(); ?>
                            </div>
                        </div>

                        <!-- </div> -->
                    </div>


                    <?php
            }
            if ($key == '5') {



                ?>



                    <div class="article-card-smoll">


                        <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">

                            <div class="article-tag" style="background-color:<?php if (!empty($terms)) {
                                echo $terms['color'][0];
                            } ?>">
                                <?php if (!empty($tags)) {
                                    echo $tags[0]->name;
                                } ?>
                            </div>
                        </div>
                        <div class="article-details">
                            <div class="article-meta childlab-text childlab-text__meta">
                                <div class="article-meta__authors">
                                    <div class="childlab-avatars">
                                        <?php
                                        $avatars = get_field('authors');
                                        if (!empty($avatars)) {
                                            foreach ($avatars as $avatar) {

                                                ?><img src="/<?php echo $avatar['user_avatar']; ?>"
                                                    class="childlab-avatar" />
                                            <?php }
                                        } ?>
                                    </div>
                                    <div class="article-meta__authors-names"><?php
                                    $avatars = get_field('authors');
                                    if (!empty($avatars)) {
                                        foreach ($avatars as $avatar) {

                                            echo (' ' . $avatar['display_name']);
                                        }
                                    }
                                    ?>

                                    </div>
                                </div> · <?php the_date(); ?>
                            </div>
                            <div class="childlab-text childlab-text__title">
                                <?php the_title(); ?>
                            </div>
                            <div class="childlab-text childlab-text__subtitle">
                                <?php the_excerpt(); ?>
                            </div>
                            <div class="childlab-text childlab-text__excerpt">
                                <?php the_content(); ?>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- </td> -->

                <?php
            }



        }
        ?>
    </div>
</div>


<?php
wp_reset_postdata(); // сброс
?>