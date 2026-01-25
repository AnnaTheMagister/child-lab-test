// example.js - логика работы примера

let graph;
let selectedTagId = null;
let selectedConnectionIndex = null;

// Модальные окна
const addTagModal = document.getElementById('addTagModal');
const addConnectionModal = document.getElementById('addConnectionModal');
const importModal = document.getElementById('importModal');

function initGraph() {
    graph = new TagGraph({
        container: document.getElementById('graph'),
        tags: JSON.parse(JSON.stringify(initialTags)),
        connections: JSON.parse(JSON.stringify(initialConnections)),
        layout: 'manual',
        spacing: 120,
        padding: 60,
        backgroundColor: '#f8f9fa',
        interactive: true,
        tagConfig: {
            fontSize: 14
        },
        connectionConfig: {
            lineWidth: 3
        },
        onTagClick: (tag) => {
            selectedTagId = tag.id;
            selectedConnectionIndex = null;
            updateTagEditor();
            updateConnectionEditor();
            updateInfoPanel();
            console.log('Выбран тег:', tag.name);
        },
        onTagDrag: (tag, xPercent, yPercent) => {
            console.log(`${tag.name}: ${xPercent.toFixed(1)}%, ${yPercent.toFixed(1)}%`);
            updateTagEditor();
        },
        onTagTextOrientationChange: (tag) => {
            console.log(`Ориентация текста ${tag.name} изменена на: ${tag.textOrientation}`);
            updateTagEditor();
            updateInfoPanel();
            updateJSONEditor();
        }
    });

    updateInfoPanel();
    updateJSONEditor();
    updateTagDropdowns();
}

function updateInfoPanel() {
    document.getElementById('tagCount').textContent = graph.getTags().length;
    document.getElementById('connectionCount').textContent = graph.getConnections().length;
    document.getElementById('layoutMode').textContent = graph.config.layout;
}

function updateTagEditor() {
    const tagEditor = document.getElementById('tagEditorControls');
    const tagInfo = document.getElementById('selectedTagInfo');

    if (selectedTagId) {
        const tag = graph.getTags().find(t => t.id === selectedTagId);
        if (tag) {
            tagEditor.style.display = 'block';
            tagInfo.style.display = 'none';

            document.getElementById('tagNameInput').value = tag.name;
            document.getElementById('tagColorInput').value = tag.color;
            document.getElementById('tagFontSizeInput').value = tag.fontSize || 14;
            document.getElementById('tagXInput').value = tag.xPercent ? tag.xPercent.toFixed(1) : '';
            document.getElementById('tagYInput').value = tag.yPercent ? tag.yPercent.toFixed(1) : '';

            document.querySelectorAll('.text-orientation-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.orientation === tag.textOrientation) {
                    btn.classList.add('active');
                }
            });
        }
    } else {
        tagEditor.style.display = 'none';
        tagInfo.style.display = 'block';
    }
}

function updateConnectionEditor() {
    const connectionEditor = document.getElementById('connectionEditorControls');
    const connectionInfo = document.getElementById('selectedConnectionInfo');

    if (selectedConnectionIndex !== null) {
        const connections = graph.getConnections();
        if (connections[selectedConnectionIndex]) {
            const conn = connections[selectedConnectionIndex];
            connectionEditor.style.display = 'block';
            connectionInfo.style.display = 'none';

            document.getElementById('connectionCurveSlider').value = conn.curveIntensity || 0;
            document.getElementById('connectionCurveValue').textContent = conn.curveIntensity || 0;
            document.getElementById('connectionWidthSlider').value = conn.lineWidth || 3;
            document.getElementById('connectionWidthValue').textContent = conn.lineWidth || 3;
        }
    } else {
        connectionEditor.style.display = 'none';
        connectionInfo.style.display = 'block';
    }
}

function updateTagDropdowns() {
    const tags = graph.getTags();
    const sourceSelect = document.getElementById('connectionSource');
    const targetSelect = document.getElementById('connectionTarget');

    const currentSource = sourceSelect.value;
    const currentTarget = targetSelect.value;

    sourceSelect.innerHTML = '<option value="">-- Выберите тег --</option>';
    targetSelect.innerHTML = '<option value="">-- Выберите тег --</option>';

    tags.forEach(tag => {
        const option1 = document.createElement('option');
        option1.value = tag.id;
        option1.textContent = tag.name;
        sourceSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = tag.id;
        option2.textContent = tag.name;
        targetSelect.appendChild(option2);
    });

    sourceSelect.value = currentSource;
    targetSelect.value = currentTarget;
}

function updateJSONEditor() {
    const json = graph.exportAsJSON();
    document.getElementById('jsonEditor').value = JSON.stringify(json, null, 2);
}

function updateButtons(activeId) {
    ['horizontalBtn', 'verticalBtn', 'circularBtn', 'gridBtn', 'manualBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (id === activeId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initGraph();
    setupEventListeners();
});

function setupEventListeners() {
    // Layout кнопки
    document.getElementById('horizontalBtn').addEventListener('click', () => {
        graph.setLayout('horizontal');
        updateButtons('horizontalBtn');
        updateInfoPanel();
        updateJSONEditor();
    });

    document.getElementById('verticalBtn').addEventListener('click', () => {
        graph.setLayout('vertical');
        updateButtons('verticalBtn');
        updateInfoPanel();
        updateJSONEditor();
    });

    document.getElementById('circularBtn').addEventListener('click', () => {
        graph.setLayout('circular');
        updateButtons('circularBtn');
        updateInfoPanel();
        updateJSONEditor();
    });

    document.getElementById('gridBtn').addEventListener('click', () => {
        graph.setLayout('grid');
        updateButtons('gridBtn');
        updateInfoPanel();
        updateJSONEditor();
    });

    document.getElementById('manualBtn').addEventListener('click', () => {
        graph.setLayout('manual');
        updateButtons('manualBtn');
        updateInfoPanel();
        updateJSONEditor();
    });

    // Настройки графа
    document.getElementById('spacingSlider').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('spacingValue').textContent = value;
        graph.setConfig({ spacing: value });
        graph.calculateLayout();
        graph.render();
        updateJSONEditor();
    });

    document.getElementById('paddingSlider').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('paddingValue').textContent = value;
        graph.setConfig({ padding: value });
        graph.calculateLayout();
        graph.render();
        updateJSONEditor();
    });

    // Настройки тегов
    document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('fontSizeValue').textContent = value;
        graph.setTagConfig({ fontSize: value });
        updateJSONEditor();
    });

    // Настройки соединений
    document.getElementById('lineWidthSlider').addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        document.getElementById('lineWidthValue').textContent = value;
        graph.setConnectionConfig({ lineWidth: value });
        updateJSONEditor();
    });

    // Кнопки ориентации текста
    document.querySelectorAll('.text-orientation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedTagId) {
                const orientation = btn.dataset.orientation;
                graph.setTagTextOrientation(selectedTagId, orientation);

                document.querySelectorAll('.text-orientation-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                updateJSONEditor();
            }
        });
    });

    // Управление тегом
    document.getElementById('updateTagBtn').addEventListener('click', () => {
        if (selectedTagId) {
            const name = document.getElementById('tagNameInput').value;
            const color = document.getElementById('tagColorInput').value;
            const fontSize = parseInt(document.getElementById('tagFontSizeInput').value);
            const xPercent = parseFloat(document.getElementById('tagXInput').value);
            const yPercent = parseFloat(document.getElementById('tagYInput').value);

            graph.updateTag(selectedTagId, {
                name,
                color,
                fontSize,
                xPercent,
                yPercent
            });
            updateJSONEditor();
        }
    });

    document.getElementById('deleteTagBtn').addEventListener('click', () => {
        if (selectedTagId && confirm('Удалить этот тег?')) {
            graph.removeTag(selectedTagId);
            selectedTagId = null;
            updateTagEditor();
            updateInfoPanel();
            updateJSONEditor();
            updateTagDropdowns();
        }
    });

    // Управление связью
    document.getElementById('updateConnectionBtn').addEventListener('click', () => {
        if (selectedConnectionIndex !== null) {
            const curveIntensity = parseFloat(document.getElementById('connectionCurveSlider').value);
            const lineWidth = parseInt(document.getElementById('connectionWidthSlider').value);

            const connections = graph.getConnections();
            const conn = connections[selectedConnectionIndex];

            graph.removeConnection(conn.source, conn.target);
            graph.addConnection({
                source: conn.source,
                target: conn.target,
                curveIntensity,
                lineWidth
            });

            updateJSONEditor();
        }
    });

    document.getElementById('deleteConnectionBtn').addEventListener('click', () => {
        if (selectedConnectionIndex !== null) {
            const connections = graph.getConnections();
            const conn = connections[selectedConnectionIndex];

            if (confirm('Удалить эту связь?')) {
                graph.removeConnection(conn.source, conn.target);
                selectedConnectionIndex = null;
                updateConnectionEditor();
                updateInfoPanel();
                updateJSONEditor();
            }
        }
    });

    // Добавление тега
    document.getElementById('addTagBtn').addEventListener('click', () => {
        document.getElementById('newTagId').value = 'tag-' + Date.now();
        document.getElementById('newTagName').value = '';
        document.getElementById('newTagColor').value = '#667eea';
        document.getElementById('newTagFontSize').value = 14;
        document.getElementById('newTagX').value = 50;
        document.getElementById('newTagY').value = 50;
        addTagModal.style.display = 'flex';
    });

    document.getElementById('confirmAddTagBtn').addEventListener('click', () => {
        const newTag = {
            id: document.getElementById('newTagId').value,
            name: document.getElementById('newTagName').value,
            color: document.getElementById('newTagColor').value,
            fontSize: parseInt(document.getElementById('newTagFontSize').value),
            textOrientation: document.getElementById('newTagTextOrientation').value,
            xPercent: parseFloat(document.getElementById('newTagX').value),
            yPercent: parseFloat(document.getElementById('newTagY').value)
        };

        if (newTag.name) {
            graph.addTag(newTag);
            addTagModal.style.display = 'none';
            updateInfoPanel();
            updateJSONEditor();
            updateTagDropdowns();
        } else {
            alert('Введите название тега!');
        }
    });

    document.getElementById('cancelAddTagBtn').addEventListener('click', () => {
        addTagModal.style.display = 'none';
    });

    // Добавление связи
    document.getElementById('addConnectionBtn').addEventListener('click', () => {
        updateTagDropdowns();
        addConnectionModal.style.display = 'flex';
    });

    document.getElementById('confirmAddConnectionBtn').addEventListener('click', () => {
        const source = document.getElementById('connectionSource').value;
        const target = document.getElementById('connectionTarget').value;
        const curveIntensity = parseFloat(document.getElementById('newConnectionCurve').value);
        const lineWidth = parseInt(document.getElementById('newConnectionWidth').value);

        if (source && target && source !== target) {
            graph.addConnection({
                source,
                target,
                curveIntensity,
                lineWidth
            });
            addConnectionModal.style.display = 'none';
            updateInfoPanel();
            updateJSONEditor();
        } else {
            alert('Выберите два разных тега!');
        }
    });

    document.getElementById('cancelAddConnectionBtn').addEventListener('click', () => {
        addConnectionModal.style.display = 'none';
    });

    // Слайдеры в модальном окне добавления связи
    document.getElementById('newConnectionCurve').addEventListener('input', (e) => {
        document.getElementById('newConnectionCurveValue').textContent = e.target.value;
    });

    document.getElementById('newConnectionWidth').addEventListener('input', (e) => {
        document.getElementById('newConnectionWidthValue').textContent = e.target.value;
    });

    // Экспорт/импорт JSON
    document.getElementById('exportBtn').addEventListener('click', () => {
        const json = graph.exportAsJSON();
        const dataStr = JSON.stringify(json, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'tag-graph-' + new Date().toISOString().slice(0, 10) + '.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });

    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importJsonTextarea').value = '';
        importModal.style.display = 'flex';
    });

    document.getElementById('confirmImportBtn').addEventListener('click', () => {
        try {
            const jsonText = document.getElementById('importJsonTextarea').value;
            const jsonData = JSON.parse(jsonText);

            if (!jsonData.tags || !jsonData.connections) {
                throw new Error('Неверный формат JSON');
            }

            graph.importFromJSON(jsonData);
            selectedTagId = null;
            selectedConnectionIndex = null;
            updateTagEditor();
            updateConnectionEditor();
            updateInfoPanel();
            updateTagDropdowns();
            updateJSONEditor();
            importModal.style.display = 'none';

            alert('Граф успешно загружен из JSON!');
        } catch (error) {
            alert('Ошибка загрузки JSON: ' + error.message);
        }
    });

    document.getElementById('cancelImportBtn').addEventListener('click', () => {
        importModal.style.display = 'none';
    });

    document.getElementById('updateFromJsonBtn').addEventListener('click', () => {
        try {
            const jsonText = document.getElementById('jsonEditor').value;
            const jsonData = JSON.parse(jsonText);

            if (!jsonData.tags || !jsonData.connections) {
                throw new Error('Неверный формат JSON');
            }

            graph.importFromJSON(jsonData);
            selectedTagId = null;
            selectedConnectionIndex = null;
            updateTagEditor();
            updateConnectionEditor();
            updateInfoPanel();
            updateTagDropdowns();

            alert('Граф обновлен из JSON!');
        } catch (error) {
            alert('Ошибка обновления из JSON: ' + error.message);
        }
    });

    document.getElementById('copyJsonBtn').addEventListener('click', () => {
        const jsonEditor = document.getElementById('jsonEditor');
        jsonEditor.select();
        document.execCommand('copy');

        const originalText = jsonEditor.value;
        jsonEditor.value = '✅ JSON скопирован в буфер обмена!';
        setTimeout(() => {
            jsonEditor.value = originalText;
        }, 1500);
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Сбросить граф к начальному состоянию?')) {
            graph.destroy();
            initGraph();
            selectedTagId = null;
            selectedConnectionIndex = null;
            updateTagEditor();
            updateConnectionEditor();
            updateButtons('manualBtn');
            updateTagDropdowns();
        }
    });

    // Закрытие модальных окон
    window.addEventListener('click', (e) => {
        if (e.target === addTagModal) addTagModal.style.display = 'none';
        if (e.target === addConnectionModal) addConnectionModal.style.display = 'none';
        if (e.target === importModal) importModal.style.display = 'none';
    });
}
