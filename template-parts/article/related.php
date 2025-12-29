<?php
// Похожие статьи по тегам
$current_tags = wp_get_post_terms(get_the_ID(), 'article_tag', array('fields' => 'ids'));

if (!empty($current_tags)) {
    $args = array(
        'post_type' => 'article',
        'posts_per_page' => 3,
        'post__not_in' => array(get_the_ID()),
        'tax_query' => array(
            array(
                'taxonomy' => 'article_tag',
                'field' => 'id',
                'terms' => $current_tags,
            ),
        ),
    );
    
    $related_articles = new WP_Query($args);
    
    if ($related_articles->have_posts()):
    ?>
    <section class="related-articles">
        <h3 class="related-title">📚 Похожие статьи</h3>
        
        <div class="related-grid">
            <?php while ($related_articles->have_posts()): $related_articles->the_post(); ?>
            <article class="related-article-card">
                <a href="<?php the_permalink(); ?>" class="related-link">
                    <?php if (has_post_thumbnail()): ?>
                    <div class="related-thumbnail">
                        <?php the_post_thumbnail('medium'); ?>
                    </div>
                    <?php endif; ?>
                    
                    <div class="related-content">
                        <h4 class="related-article-title"><?php the_title(); ?></h4>
                        
                        <?php 
                        $excerpt = wp_trim_words(get_the_excerpt(), 15);
                        if ($excerpt):
                        ?>
                        <p class="related-excerpt"><?php echo $excerpt; ?></p>
                        <?php endif; ?>
                        
                        <div class="related-meta">
                            <span class="related-date"><?php echo get_the_date('d.m.Y'); ?></span>
                            <span class="related-reading-time">
                                <?php 
                                $reading_time = get_field('reading_time') ?: 5;
                                echo '~' . $reading_time . ' мин.';
                                ?>
                            </span>
                        </div>
                    </div>
                </a>
            </article>
            <?php endwhile; ?>
        </div>
    </section>
    <?php
    endif;
    wp_reset_postdata();
}
?>