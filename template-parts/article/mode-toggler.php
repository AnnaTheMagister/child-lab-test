<?php
// В любом месте шаблона (header.php или sidebar.php)
$current_mode = $GLOBALS['mode'];
?>
<?php
$mode_scientist = 'scientist';
$mode_longist = 'long';

switch ($current_mode) {
    case 'scientist_long':
        $mode_scientist = 'scientist';
        $mode_longist = 'long';
        break;

    case 'scientist_short':

        $mode_scientist = 'scientist';
        $mode_longist = 'short';
        break;

    case 'parent_long':

        $mode_scientist = 'parent';
        $mode_longist = 'long';
        break;

    case 'parent_short':

        $mode_scientist = 'parent';
        $mode_longist = 'short';
        break;

    default:
        $mode_scientist = 'scientist';
        $mode_longist = 'long';
}

?>

<div class="switchers">
    <h4 class="switchers-title">Адаптировать статью</h4>
    <div class="switcher">
        <div class="switcher__label">Роль</div>
        <div class="switcher_bar">

            <a href="?reading_mode=parent_<?php echo ($mode_longist); ?>"
                class="mode-btn <?php echo $current_mode == 'scientist_long' ? 'active' : ''; ?>">
                <div class="switcher_button<?php if ($mode_scientist == 'parent') {
                    echo '_selected';
                }
                ; ?>">
                    <div class="switcher_dot"></div>
                </div>
            </a>
            <a href="?reading_mode=scientist_<?php echo ($mode_longist); ?>"
                class="mode-btn <?php echo $current_mode == 'scientist_short' ? 'active' : ''; ?>">
                <div class="switcher_button<?php if ($mode_scientist == 'scientist') {
                    echo '_selected';
                }
                ; ?>">
                    <div class="switcher_dot"></div>
                </div>
            </a>

        </div>
        <div class="switcher_text">
            <p class="switcher_text<?php if ($mode_scientist == 'parent') {
                echo '_selected';
            }
            ; ?>">Родитель</p>
        </div>
        <div class="switcher_text">
            <p class="switcher_text<?php if ($mode_scientist == 'scientist') {
                echo '_selected';
            }
            ; ?>">Педагог</p>
        </div>

    </div>
    <div class="switcher">
        <div class="switcher__label">Длина</div>
        <div class="switcher_bar">
            <a href="?reading_mode=<?php echo ($mode_scientist); ?>_short"
                class="mode-btn <?php echo $current_mode == 'parent_short' ? 'active' : ''; ?>">
                <div class="switcher_button<?php if ($mode_longist == 'short') {
                    echo '_selected';
                }
                ; ?>">
                    <div class="switcher_dot"></div>
                </div>
            </a>

            <a href="?reading_mode=<?php echo ($mode_scientist); ?>_long"
                class="mode-btn <?php echo $current_mode == 'parent_long' ? 'active' : ''; ?>">

                <div class="switcher_button<?php if ($mode_longist == 'long') {
                    echo '_selected';
                }
                ; ?>">
                    <div class="switcher_dot"></div>
                </div>
            </a>
        </div>
        <div class="switcher_text">
            <p class="switcher_text<?php if ($mode_longist == 'short') {
                echo '_selected';
            }
            ; ?>">Коротко</p>
        </div>
        <div class="switcher_text">
            <p class="switcher_text<?php if ($mode_longist == 'long') {
                echo '_selected';
            }
            ; ?>">Длинно</p>
        </div>

    </div>
    <!-- <?php
    print_r($mode_scientist);
    print_r($mode_longist);
    ?> -->


</div>