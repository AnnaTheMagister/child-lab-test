<?php
// Переключатель 4 режимов
$current_mode = get_reading_mode();
?>

<div class="reading-mode-switcher">
    <div class="mode-switcher-header">
        <h4 class="switcher-title">🎯 Выберите формат статьи:</h4>
        <button class="close-switcher" aria-label="Закрыть">×</button>
    </div>
    
    <div class="mode-options-grid">
        
        <!-- Для ученых -->
        <div class="mode-option-group scientist-group">
            <h5 class="group-title">🔬 Для ученых и специалистов</h5>
            
            <a href="?reading_mode=scientist_long" 
               class="mode-option <?php echo $current_mode == 'scientist_long' ? 'active' : ''; ?>"
               data-mode="scientist_long">
                <div class="option-icon">📄</div>
                <div class="option-content">
                    <h6>Полная версия</h6>
                    <p class="option-description">
                        Полный научный текст с терминами, ссылками и данными исследований
                    </p>
                </div>
            </a>
            
            <a href="?reading_mode=scientist_short" 
               class="mode-option <?php echo $current_mode == 'scientist_short' ? 'active' : ''; ?>"
               data-mode="scientist_short">
                <div class="option-icon">📝</div>
                <div class="option-content">
                    <h6>Краткая версия</h6>
                    <p class="option-description">
                        Ключевые выводы и основные тезисы для быстрого ознакомления
                    </p>
                </div>
            </a>
        </div>
        
        <!-- Для родителей -->
        <div class="mode-option-group parent-group">
            <h5 class="group-title">👨‍👩‍👧 Для родителей и педагогов</h5>
            
            <a href="?reading_mode=parent_long" 
               class="mode-option <?php echo $current_mode == 'parent_long' ? 'active' : ''; ?>"
               data-mode="parent_long">
                <div class="option-icon">📖</div>
                <div class="option-content">
                    <h6>Полная версия</h6>
                    <p class="option-description">
                        Подробное объяснение на понятном языке с практическими советами
                    </p>
                </div>
            </a>
            
            <a href="?reading_mode=parent_short" 
               class="mode-option <?php echo $current_mode == 'parent_short' ? 'active' : ''; ?>"
               data-mode="parent_short">
                <div class="option-icon">💡</div>
                <div class="option-content">
                    <h6>Краткая версия</h6>
                    <p class="option-description">
                        Главные идеи и конкретные рекомендации для применения
                    </p>
                </div>
            </a>
        </div>
        
    </div>
    
    <!-- Сохранение предпочтений -->
    <div class="mode-preferences">
        <label class="preference-option">
            <input type="checkbox" id="remember-mode" checked>
            <span>Запомнить мой выбор</span>
        </label>
        
        <button class="apply-mode-btn" data-action="apply-mode">
            Применить выбранный режим
        </button>
    </div>
</div>