<?php
// В любом месте шаблона (header.php или sidebar.php)
// TODO: Refactor .mode-btn to ui-kit/Button
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

<!-- Иконка для открытия виджета на мобильных -->
<div class="mobile-switcher-toggle" id="mobileSwitcherToggle">
    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1C0 1.26522 0.105357 1.51957 0.292893 1.70711C0.48043 1.89464 0.734784 2 1 2H17C17.2652 2 17.5196 1.89464 17.7071 1.70711C17.8946 1.51957 18 1.26522 18 1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0H1ZM14 4C14.2086 4.00008 14.4119 4.06539 14.5816 4.18679C14.7512 4.30818 14.8786 4.47959 14.946 4.677L15.076 5.055C15.224 5.48875 15.4694 5.88283 15.7934 6.20699C16.1174 6.53115 16.5113 6.77677 16.945 6.925L17.323 7.054C17.5202 7.12157 17.6913 7.24908 17.8125 7.41869C17.9337 7.58831 17.9988 7.79155 17.9988 8C17.9988 8.20845 17.9337 8.41169 17.8125 8.58131C17.6913 8.75092 17.5202 8.87843 17.323 8.946L16.945 9.076C16.5112 9.224 16.1172 9.46941 15.793 9.79339C15.4688 10.1174 15.2232 10.5113 15.075 10.945L14.946 11.323C14.8784 11.5202 14.7509 11.6913 14.5813 11.8125C14.4117 11.9337 14.2085 11.9988 14 11.9988C13.7915 11.9988 13.5883 11.9337 13.4187 11.8125C13.2491 11.6913 13.1216 11.5202 13.054 11.323L12.924 10.945C12.776 10.5112 12.5306 10.1172 12.2066 9.79301C11.8826 9.46885 11.4887 9.22323 11.055 9.075L10.677 8.946C10.4798 8.87843 10.3087 8.75092 10.1875 8.58131C10.0663 8.41169 10.0012 8.20845 10.0012 8C10.0012 7.79155 10.0663 7.58831 10.1875 7.41869C10.3087 7.24908 10.4798 7.12157 10.677 7.054L11.055 6.924C11.4888 6.776 11.8828 6.53059 12.207 6.20661C12.5312 5.88262 12.7768 5.48868 12.925 5.055L13.054 4.677C13.1214 4.47959 13.2488 4.30818 13.4184 4.18679C13.5881 4.06539 13.7914 4.00008 14 4ZM14 7.196C13.7634 7.4937 13.4937 7.76344 13.196 8C13.4947 8.23667 13.7627 8.50467 14 8.804C14.2367 8.50467 14.5047 8.23667 14.804 8C14.5063 7.76344 14.2366 7.4937 14 7.196ZM0 15C0 14.7348 0.105357 14.4804 0.292893 14.2929C0.48043 14.1054 0.734784 14 1 14H2C2.26522 14 2.51957 14.1054 2.70711 14.2929C2.89464 14.4804 3 14.7348 3 15C3 15.2652 2.89464 15.5196 2.70711 15.7071C2.51957 15.8946 2.26522 16 2 16H1C0.734784 16 0.48043 15.8946 0.292893 15.7071C0.105357 15.5196 0 15.2652 0 15ZM11 14C10.7348 14 10.4804 14.1054 10.2929 14.2929C10.1054 14.4804 10 14.7348 10 15C10 15.2652 10.1054 15.5196 10.2929 15.7071C10.4804 15.8946 10.7348 16 11 16H12C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15C13 14.7348 12.8946 14.4804 12.7071 14.2929C12.5196 14.1054 12.2652 14 12 14H11ZM5 15C5 14.7348 5.10536 14.4804 5.29289 14.2929C5.48043 14.1054 5.73478 14 6 14H7C7.26522 14 7.51957 14.1054 7.70711 14.2929C7.89464 14.4804 8 14.7348 8 15C8 15.2652 7.89464 15.5196 7.70711 15.7071C7.51957 15.8946 7.26522 16 7 16H6C5.73478 16 5.48043 15.8946 5.29289 15.7071C5.10536 15.5196 5 15.2652 5 15ZM16 14C15.7348 14 15.4804 14.1054 15.2929 14.2929C15.1054 14.4804 15 14.7348 15 15C15 15.2652 15.1054 15.5196 15.2929 15.7071C15.4804 15.8946 15.7348 16 16 16H17C17.2652 16 17.5196 15.8946 17.7071 15.7071C17.8946 15.5196 18 15.2652 18 15C18 14.7348 17.8946 14.4804 17.7071 14.2929C17.5196 14.1054 17.2652 14 17 14H16ZM0 8C0 7.73478 0.105357 7.48043 0.292893 7.29289C0.48043 7.10536 0.734784 7 1 7H7C7.26522 7 7.51957 7.10536 7.70711 7.29289C7.89464 7.48043 8 7.73478 8 8C8 8.26522 7.89464 8.51957 7.70711 8.70711C7.51957 8.89464 7.26522 9 7 9H1C0.734784 9 0.48043 8.89464 0.292893 8.70711C0.105357 8.51957 0 8.26522 0 8Z"
            fill="#5230D0" />
    </svg>

</div>

<!-- Основной контейнер виджета -->
<div class="switchers" id="readingModeSwitcher">
    <!-- Кнопка закрытия для мобильных -->
    <button class="switchers-close" id="switcherClose">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 5L5 15M5 5l10 10" />
        </svg>
    </button>

    <h4 class="switchers-title"><?php esc_html_e("Адаптировать статью", "childlab") ?></h4>
    <div class="container">
        <div class="row switchers-container">
            <div>
                <div class="switcher">
                    <div class="switcher__label"><?php esc_html_e("Роль", "childlab") ?></div>
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
                        ; ?>"><?php esc_html_e("Родитель", "childlab") ?></p>
                    </div>
                    <div class="switcher_text">
                        <p class="switcher_text<?php if ($mode_scientist == 'scientist') {
                            echo '_selected';
                        }
                        ; ?>"><?php esc_html_e("Педагог", "childlab") ?></p>
                    </div>
                </div>
            </div>
            <div>
                <div class="switcher">
                    <div class="switcher__label"><?php esc_html_e("Длина", "childlab") ?></div>
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
                        ; ?>"><?php esc_html_e("Коротко", "childlab") ?></p>
                    </div>
                    <div class="switcher_text">
                        <p class="switcher_text<?php if ($mode_longist == 'long') {
                            echo '_selected';
                        }
                        ; ?>"><?php esc_html_e("Длинно", "childlab") ?></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>