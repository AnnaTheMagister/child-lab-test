const initialTags = [
  {
    id: "Agency",
    name: "Субъектность",
    color: "#90b636",
    direction: "h",
    textOrientation: "horizontal",
    x: 310,
    y: 46,
  },
  {
    id: "Self_regulatory_abilities",
    name: "Регуляторные способности",
    color: "#38d37c",
    direction: "h",
    textOrientation: "horizontal",
    x: 230,
    y: 105,
  },
  {
    id: "Cognitive_abilities",
    name: "Познавательные способности",
    color: "#dcc22d",
    direction: "h",
    textOrientation: "horizontal",
    x: 404,
    y: 105,
  },
  {
    id: "Communicative_abilities",
    name: "Коммуникативные способности",
    color: "#db508f",
    direction: "h",
    textOrientation: "horizontal",
    x: 310,
    y: 135,
  },
  {
    id: "Planning",
    name: "Планирование",
    color: "#64AF38",
    direction: "v",
    textOrientation: "horizontal",
    x: 140,
    y: 80,
  },
  {
    id: "Imagination",
    name: "Воображение",
    color: "#BECC1C",
    direction: "v",
    textOrientation: "horizontal",
    x: 480,
    y: 80,
  },
];

const initialConnections = [
  {
    source: "Cognitive_abilities",
    target: "Imagination",
    strength: 0.5,
  },
  {
    source: "Cognitive_abilities",
    target: "Agency",
    strength: 1,
  },
  {
    source: "Cognitive_abilities",
    target: "Communicative_abilities",
    strength: 1,
  },
  {
    source: "Cognitive_abilities",
    target: "Self_regulatory_abilities",
    strength: 1,
  },
  {
    source: "Self_regulatory_abilities",
    target: "Agency",
    strength: 1,
  },
  {
    source: "Self_regulatory_abilities",
    target: "Communicative_abilities",
    strength: 1,
  },
  {
    source: "Agency",
    target: "Communicative_abilities",
    strength: 1,
  },
  {
    source: "Planning",
    target: "Self_regulatory_abilities",
    strength: 0.5,
  },
];

function initGraph() {
  graph = new TagGraph({
    container: document.getElementById("graph"),
    tags: JSON.parse(JSON.stringify(initialTags)),
    connections: JSON.parse(JSON.stringify(initialConnections)),
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
        history.pushState({}, "", newUrl); // Update URL in history
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
