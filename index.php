<?php

get_header(); ?>

<!-- example react component -->
<div id="render-react-example-here"></div>
<!-- end example react component -->

<div class="container">
  <?php if (have_posts()) {
    while (have_posts()) {
      the_post(); ?>
      <div>
        <h3><?php the_title(); ?></h3>
          <?php the_content(); ?>
      </div>
    <?php }
  }
  ?>
</div>

<?php
get_footer();
?>