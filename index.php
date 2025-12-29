<?php

get_header(); ?>

<!-- example react component -->
<div id="render-react-example-here"></div>
<!-- end example react component -->

<?php if (have_posts()) {

}

get_footer();
?>


<?php
// В любом месте шаблона (header.php или sidebar.php)
$current_mode = get_reading_mode();
?>

<div class="reading-mode-switcher">
    <h4>Режим просмотра:</h4>
    
    <div class="mode-buttons">
        <!-- Ученые -->
        <div class="mode-group">
            <span class="group-label">Для ученых:</span>
            <a href="?reading_mode=scientist_long" 
               class="mode-btn <?php echo $current_mode == 'scientist_long' ? 'active' : ''; ?>">
                📄 Полная версия
            </a>
            <a href="?reading_mode=scientist_short" 
               class="mode-btn <?php echo $current_mode == 'scientist_short' ? 'active' : ''; ?>">
                📝 Кратко
            </a>
        </div>
        
        <!-- Родители -->
        <div class="mode-group">
            <span class="group-label">Для родителей:</span>
            <a href="?reading_mode=parent_long" 
               class="mode-btn <?php echo $current_mode == 'parent_long' ? 'active' : ''; ?>">
                👨‍👩‍👧 Полная версия
            </a>
            <a href="?reading_mode=parent_short" 
               class="mode-btn <?php echo $current_mode == 'parent_short' ? 'active' : ''; ?>">
                👶 Кратко
            </a>
        </div>
    </div>
</div>

<?php
// В single-article.php или article-card.php
function display_article_content($post_id = null) {
    if (!$post_id) {
        $post_id = get_the_ID();
    }
    
    $mode = get_reading_mode();
    
    switch($mode) {
        case 'scientist_long':
            $content = get_field('for_scientist_long', $post_id);
            $class = 'mode-scientist-long';
            break;
            
        case 'scientist_short':
            $content = get_field('for_scientist_short', $post_id);
            $class = 'mode-scientist-short';
            break;
            
        case 'parent_long':
            $content = get_field('for_parent_long', $post_id);
            $class = 'mode-parent-long';
            break;
            
        case 'parent_short':
            $content = get_field('for_parent_short', $post_id);
            $class = 'mode-parent-short';
            break;
            
        default:
            $content = get_field('preview', $post_id);
            $class = 'mode-default';
    }
    
    // $content = get_the_content(null, false, $content);
    if (empty($content)) {
        // Если поле пустое, показываем стандартный контент
        $content = get_the_content(null, false, $post_id);
    }
    
    // Обертываем в div с классом режима
    echo '<div class="article-content ' . esc_attr($class) . '">' . $content . '</div>';
}
?>



<!-- В шаблоне статьи -->
<article>
    <h1><?php the_title(); ?></h1>
    <?php
      if ( function_exists( 'kadence_table_of_contents' ) ) {
          echo kadence_table_of_contents();
      }
    ?>

    <?php display_article_content(); ?>

</article>

<?php
if ( have_posts() ) : while ( have_posts() ) : the_post();
    // Выводим контент с поддержкой блоков
    the_content();
    

endwhile; endif;
?>

<?php