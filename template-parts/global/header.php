<header id="masthead" class="childlab-header">
    <!-- Логотип -->
    <div class="childlab-site-branding">
        <?php
        if (has_custom_logo()) {
            the_custom_logo();
        } else {
            ?>
            <a href="<?php echo esc_url(home_url('/')); ?>" class="site-title">
                <?php bloginfo('name'); ?>
            </a>
            <?php
        }
        ?>
    </div>
    <button class="childlab-menu-toggle" aria-label="Открыть меню" aria-expanded="false">
        <span class="childlab-menu-toggle__icon">
            <span></span>
            <span></span>
            <span></span>
        </span>
    </button>
    <nav class="childlab-main-navigation">
        <?php
        wp_nav_menu(array(
            'theme_location' => '',
            'menu_class' => 'childlab-primary-menu',
            'container' => false,
            'fallback_cb' => false
        ));
        ?>
    </nav>


</header>
<div class="page-layout">