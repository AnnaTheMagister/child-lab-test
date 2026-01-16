const initialData = {
  tags: [
    {
      id: "Agency",
      name: "Субъектность",
      color: "#90b636",
      textOrientation: "horizontal",
      x: 330,
      y: 50,
    },
    {
      id: "Self_regulatory_abilities",
      name: "Регуляторные способности",
      color: "#38d37c",
      textOrientation: "horizontal",
      x: 210,
      y: 120,
    },
    {
      id: "Cognitive_abilities",
      name: "Познавательные способности",
      color: "#dcc22d",
      textOrientation: "horizontal",
      x: 450,
      y: 120,
    },
    {
      id: "Communicative_abilities",
      name: "Коммуникативные способности",
      color: "#db508f",
      textOrientation: "horizontal",
      x: 330,
      y: 200,
    },
    {
      id: "Planning",
      name: "Планирование",
      color: "#64af38",
      textOrientation: "horizontal",
      x: 80,
      y: 70,
    },
    {
      id: "Imagination",
      name: "Воображение",
      color: "#becc1c",
      direction: "auto",
      textOrientation: "horizontal",
      x: 580,
      y: 70,
    },
    {
      id: "Dialectical_thinking",
      name: "Диалектическое мышление",
      color: "#f3c932",
      textOrientation: "horizontal",
      x: 580,
      y: 180,
    },
    {
      id: "Anticipation",
      name: "Предвосхищение",
      color: "#e99030",
      textOrientation: "horizontal",
      x: 550,
      y: 250,
    },
    {
      id: "argumentation",
      name: "Аргументация",
      color: "#ea6695",
      direction: "auto",
      textOrientation: "horizontal",
      x: 490,
      y: 300,
    },
    {
      id: "Decentration",
      name: "Децентрация",
      color: "#D34FB5",
      direction: "auto",
      textOrientation: "horizontal",
      x: 330,
      y: 300,
    },
    {
      id: "Volitional_control",
      color: "#49C64F",
      name: "Произвольность",
      textOrientation: "horizontal",
      x: 80,
      y: 160,
    },
    {
      id: "moral_reasoning",
      color: "#B949D4",
      name: "Моральные суждения",
      textOrientation: "horizontal",
      x: 330,
      y: 370,
    },
    {
      id: "reflection",
      color: "#9AD04A",
      name: "Рефлексия",
      textOrientation: "horizontal",
      x: 180,
      y: 290,
    },
    {
      id: "construction",
      color: "#6E41D8",
      name: "Конструирование",
      textOrientation: "vertical",
      x: 360,
      y: 530,
    },
    {
      id: "shared_reading",
      color: "#4164D9",
      name: "Совместное чтение",
      textOrientation: "vertical",
      x: 320,
      y: 570,
    },
    {
      id: "children_storytelling",
      color: "#50D4CB",
      name: "Детское сочинительство",
      textOrientation: "vertical",
      x: 280,
      y: 550,
    },
    {
      id: "experimentation",
      color: "#42A0CC",
      name: "Экспериментирование",
      textOrientation: "vertical",
      x: 400,
      y: 550,
    },
    {
      id: "game",
      color: "#aA8740",
      name: "Игра",
      textOrientation: "horizontal",
      x: 330,
      y: 710,
    },
    {
      id: "attachment",
      color: "#8A6720",
      name: "Привязанность",
      textOrientation: "horizontal",
      x: 330,
      y: 750,
    },
  ],
  connections: [
    {
      source: "Cognitive_abilities",
      target: "Imagination",
      strength: 1,
    },
    {
      source: "Cognitive_abilities",
      target: "Agency",
      strength: 5,
    },
    {
      source: "Cognitive_abilities",
      target: "Communicative_abilities",
      strength: 5,
    },
    {
      source: "Cognitive_abilities",
      target: "Self_regulatory_abilities",
      strength: 5,
    },
    {
      source: "Self_regulatory_abilities",
      target: "Agency",
      strength: 5,
    },
    {
      source: "Self_regulatory_abilities",
      target: "Communicative_abilities",
      strength: 5,
    },
    {
      source: "Agency",
      target: "Communicative_abilities",
      strength: 5,
    },
    {
      source: "Planning",
      target: "Self_regulatory_abilities",
      strength: 1,
    },
    {
      source: "Dialectical_thinking",
      target: "Cognitive_abilities",
      strength: 1,
    },
    {
      source: "Anticipation",
      target: "Cognitive_abilities",
      strength: 1,
    },
    {
      source: "argumentation",
      target: "Cognitive_abilities",
      strength: 1,
    },
    {
      source: "Communicative_abilities",
      target: "argumentation",
      strength: 1,
    },
    {
      source: "Communicative_abilities",
      target: "Decentration",
      strength: 1,
    },
    {
      source: "Self_regulatory_abilities",
      target: "Volitional_control",
      strength: 1,
    },
    {
      source: "moral_reasoning",
      target: "Cognitive_abilities",
      strength: 1,
    },
    {
      source: "reflection",
      target: "Cognitive_abilities",
      strength: 1,
    },
    {
      source: "reflection",
      target: "Self_regulatory_abilities",
      strength: 1,
    },
    {
      source: "construction",
      target: "moral_reasoning",
      strength: 1,
    },
    {
      source: "experimentation",
      target: "moral_reasoning",
      strength: 1,
    },
    {
      source: "moral_reasoning",
      target: "children_storytelling",
      strength: 1,
    },
    {
      source: "moral_reasoning",
      target: "shared_reading",
      strength: 1,
    },
    {
      source: "construction",
      target: "game",
      strength: 1,
    },
    {
      source: "experimentation",
      target: "game",
      strength: 1,
    },
    {
      source: "game",
      target: "children_storytelling",
      strength: 1,
    },
    {
      source: "game",
      target: "shared_reading",
      strength: 1,
    },
        {
      source: "game",
      target: "attachment",
      strength: 1,
    },
  ],
  config: {
    layout: "horizontal",
    spacing: 120,
    padding: 60,
    curveIntensity: 0.5,
    lineWidth: 3,
    textOrientation: "horizontal",
  },
};

function initGraph() {
  graph = new TagGraph({
    container: document.getElementById("graph"),
    tags: JSON.parse(JSON.stringify(initialData.tags)),
    connections: JSON.parse(JSON.stringify(initialData.connections)),
    layout: "manual",
    spacing: 60,
    padding: 20,
    curveIntensity: 0.7,
    lineWidth: 2,
    textOrientation: "horizontal",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    interactive: true,
    onTagClick: (tag) => {
      if ("URLSearchParams" in window) {
        let searchParams = new URLSearchParams(window.location.search);
        searchParams.set("methodology", tag.id); // Sets or updates 'q'
        let newUrl = "?" + searchParams.toString();
        // history.pushState({}, "", newUrl); // Update URL in history
        window.location.href = newUrl;
      }
      selectedTagId = tag.id;
      updateTagEditor();
      updateInfoPanel();
      console.log("Выбран тег:", tag.name);
    },
    onTagDrag: (tag, x, y) => {
      console.log(`Перемещение ${tag.name}`);
    },
    onTagDirectionChange: (tag) => {
      console.log(`Направление ${tag.name} изменено на: ${tag.direction}`);
      updateTagEditor();
      updateInfoPanel();
      updateJSONEditor();
    },
    onTagTextOrientationChange: (tag) => {
      console.log(
        `Ориентация текста ${tag.name} изменена на: ${tag.textOrientation}`
      );
      updateTagEditor();
      updateInfoPanel();
      updateJSONEditor();
    },
  });
}

document.addEventListener("DOMContentLoaded", initGraph);
