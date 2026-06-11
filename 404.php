<?php

get_header(); ?>

<div class="container not-found-page">
    <h1>404</h1>
    <h2>Страница не найдена</h2>
    <p>Такой страницы у нас нет... Может, вернёмся на главную?</p>
    <!-- TODO: Refactor to ui-kit/Button -->
    <a class="not-found-page-link" href="<?php echo get_home_url(); ?>"><div>На главную</div></a>
</div>



<?php get_footer(); ?>