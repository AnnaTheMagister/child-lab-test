<?php
// В любом месте шаблона (header.php или sidebar.php)
$current_mode = $GLOBALS['mode'];
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