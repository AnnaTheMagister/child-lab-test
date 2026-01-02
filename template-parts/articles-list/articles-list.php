<table>


    <?php

    $posts = get_posts(array(
        'numberposts' => -1,
        //  'category_name' => 'slider',
        'orderby' => 'date',
        'order' => 'ASC',
        'post_type' => 'article',
        'suppress_filters' => true, // подавление работы фильтров изменения SQL запроса
    ));

    foreach ($posts as $key => $post) {
        setup_postdata($post);

        // echo''. $key ;
    

        if ($key === "1") {
            echo ('<tr ><td rowspan ="2" >');
        } else {
            if ($key === "4") {
                echo ("<tr>");
            }
            echo ("<td>");


        }


      //  echo ("122=");
        //   $avatars = get_field('methodology_tag');
        $tags = get_the_terms($post->id, 'methodology_tag');
        //print_r(value: $tags);
        if ($tags) {
        $terms=get_term_meta($tags[0]->term_id);
        }
        // print_r($terms['color'][0]);


       //  Array ( [name] => Array ( [0] => ) [_name] => Array ( [0] => field_6956578284f04 ) [color] => Array ( [0] => #becc1c ) [_color] => Array ( [0] => field_6956572784f03 ) [description] => Array ( [0] => впвпыпп ) [_description] => Array ( [0] => field_695656c584f02 ) )
       
        //  $colors= get_term_meta( 9 , 'term_color', false );
        //  print_r($color);
        //   //  if (!empty($colors)) {print_r ($colors);}
          
        // if (!empty($tags)) {
        //     foreach ($tags as $tag) {
        //         // echo json_encode($tag);
        //         // echo ($avatar['name'] . ' ');
        //         // print_r($tag);
        //     }
        // }
    
        ?>

        <div class="article-card">

            <div class="article-img" style="background-image: url('<?php the_post_thumbnail_url(); ?>');">

                <div class="article-tag" style="background-color:<?php if (!empty($terms)) {
           echo $terms['color'][0];} ?>">
                    <?php if (!empty($tags)) {
           echo $tags[0]->name;} ?></div>
            </div>
            <div class="article-details">
                <div class="article-meta childlab-text childlab-text__meta">
                    <div class="article-meta__authors">
                        <div class="childlab-avatars">
                            <?php
                            $avatars = get_field('authors');
                            if (!empty($avatars)) {
                                foreach ($avatars as $avatar) {

                                    ?><img src="/<?php echo $avatar['user_avatar']; ?>" class="childlab-avatar" />
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

        <!-- </td> -->
        <?php
        if ($key === "4") {
            echo ("</tr>");
        }
        if ($key === "1") {
            echo ("</tr>");
        }


    }

    wp_reset_postdata(); // сброс
    ?>
</table>