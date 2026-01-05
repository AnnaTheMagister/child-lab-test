<?php
// В любом месте шаблона (header.php или sidebar.php)
$current_mode = $GLOBALS['mode'];
?>


<div class="swichers">
    <h2>Адаптировать статью</h2>
    <div class="swicher">
        <h3>Для педагога</h3>
        <div class="swicher_bar">
            <a href="?reading_mode=scientist_long"
                class="mode-btn <?php echo $current_mode == 'scientist_long' ? 'active' : ''; ?>">
                <div class="swicher_button">
                    <div class="swicher_dot"></div>
                </div>
            </a>
            <a href="?reading_mode=scientist_short"
                class="mode-btn <?php echo $current_mode == 'scientist_short' ? 'active' : ''; ?>">
                <div class="swicher_button_selected">
                    <div class="swicher_dot"></div>
                </div>
            </a>

        </div>
        <div class="swicher_text">
            <p>Длинно</p>
        </div>
        <div class="swicher_text">
            <p class="swicher_text_select">Коротко</p>
        </div>

    </div>
    <div class="swicher">
        <h3>Для родителей</h3>
        <div class="swicher_bar">
            <a href="?reading_mode=parent_long"
                class="mode-btn <?php echo $current_mode == 'parent_long' ? 'active' : ''; ?>">
                <div class="swicher_button">
                    <div class="swicher_dot"></div>
                </div>
            </a>

            <a href="?reading_mode=parent_short"
                class="mode-btn <?php echo $current_mode == 'parent_short' ? 'active' : ''; ?>">

                <div class="swicher_button_selected">
                    <div class="swicher_dot"></div>
                </div>
            </a>
        </div>
        <div class="swicher_text">
            <p>Длинно</p>
        </div>
        <div class="swicher_text">
            <p class="swicher_text_select">Коротко</p>
        </div>

    </div>



</div>