const patterns = [
  ["Factory Method", "creational", "Delegate object creation to subclasses without binding callers to concrete classes.", "creation"],
  ["Abstract Factory", "creational", "Create related object families while keeping clients independent from concrete products.", "families"],
  ["Builder", "creational", "Assemble complex objects step by step with readable construction paths.", "assembly"],
  ["Prototype", "creational", "Clone configured objects when construction is costly or shape varies.", "cloning"],
  ["Singleton", "creational", "Coordinate one shared instance when global access is intentional and controlled.", "lifecycle"],
  ["Adapter", "structural", "Make incompatible interfaces collaborate without changing either side.", "integration"],
  ["Bridge", "structural", "Split abstraction from implementation so both can vary independently.", "platforms"],
  ["Composite", "structural", "Treat individual objects and object trees through one interface.", "trees"],
  ["Decorator", "structural", "Add behavior around an object without changing its class.", "layers"],
  ["Facade", "structural", "Offer a simpler front door to a complicated subsystem.", "simplify"],
  ["Flyweight", "structural", "Share repeated state to reduce memory pressure at scale.", "scale"],
  ["Proxy", "structural", "Control access to another object for lazy loading, security, or remote calls.", "access"],
  ["Chain of Responsibility", "behavioral", "Pass a request through handlers until one can handle it.", "routing"],
  ["Command", "behavioral", "Turn an action into an object that can be queued, retried, logged, or undone.", "actions"],
  ["Iterator", "behavioral", "Traverse a collection without exposing how it is stored.", "traversal"],
  ["Mediator", "behavioral", "Centralize communication among objects that would otherwise tangle together.", "coordination"],
  ["Memento", "behavioral", "Capture and restore object state without exposing internals.", "state"],
  ["Observer", "behavioral", "Notify subscribers when a subject changes.", "events"],
  ["State", "behavioral", "Move state-specific behavior into separate objects.", "mode"],
  ["Strategy", "behavioral", "Swap algorithms behind a stable interface at compile time or runtime.", "choice"],
  ["Template Method", "behavioral", "Define an algorithm skeleton while letting steps vary.", "workflow"],
  ["Visitor", "behavioral", "Add operations across object structures without editing every class.", "operations"]
];

const scenarios = {
  "Object creation complexity": {
    title: "Builder with Factory Method",
    confidence: "88%",
    fit: "Your risk is mostly about construction. Builder keeps configuration readable while Factory Method hides which concrete product is selected.",
    watch: "Do not introduce a builder for small value objects. The extra API should pay for itself through validation, defaults, or multi-step assembly.",
    steps: ["List required and optional construction inputs.", "Extract product selection into factory methods.", "Use a builder only for products with meaningful construction phases."]
  },
  "Interface mismatch": {
    title: "Adapter behind a Facade",
    confidence: "86%",
    fit: "The pressure is integration. Adapter translates awkward third-party or legacy contracts, while Facade gives your codebase one clean entry point.",
    watch: "Avoid leaking vendor vocabulary through your domain API. If the adapter starts owning workflow rules, split those rules into a service.",
    steps: ["Define the domain-facing interface first.", "Wrap each incompatible provider with an adapter.", "Expose the smallest useful facade to callers."]
  },
  "Runtime behavior switching": {
    title: "State or Strategy",
    confidence: "90%",
    fit: "You need behavior to change while the system runs. Strategy fits interchangeable algorithms; State fits lifecycle modes where transitions matter.",
    watch: "Strategy should not need to know the whole object lifecycle. If it does, the problem is probably stateful rather than algorithmic.",
    steps: ["Name the runtime modes or algorithms.", "Separate stable context from varying behavior.", "Add tests around transitions or strategy selection."]
  },
  "Cross-service coupling": {
    title: "Observer with Mediator",
    confidence: "82%",
    fit: "The risk is tangled communication. Observer lets services react to events, while Mediator can centralize orchestration when direct chatter grows.",
    watch: "Events can hide dependencies. Keep event names, schemas, ownership, and failure behavior explicit.",
    steps: ["Map who publishes and who reacts.", "Define event contracts and delivery guarantees.", "Use a mediator only where orchestration has real business meaning."]
  },
  "Change frequency": {
    title: "Strategy with Command support",
    confidence: "91%",
    fit: "Your goal asks for interchangeable behavior, isolated tests, and runtime selection. Strategy keeps variation swappable while Command can encapsulate scheduled or retried work.",
    watch: "Avoid creating one class per tiny variation. Keep shared retry, tracing, and validation outside individual strategies unless the variation owns that policy.",
    steps: ["Define the stable behavior contract.", "Move each variation into a strategy implementation.", "Wrap scheduled or retryable work as commands with metadata."]
  }
};

const grid = document.querySelector("#patternGrid");
const tabs = document.querySelectorAll(".tab");
const form = document.querySelector("#advisorForm");
const title = document.querySelector("#recommendationTitle");
const confidence = document.querySelector("#confidenceValue");
const fitSummary = document.querySelector("#fitSummary");
const watchSummary = document.querySelector("#watchSummary");
const nextSteps = document.querySelector("#nextSteps");

function renderPatterns(filter = "all") {
  grid.innerHTML = "";
  patterns
    .filter((pattern) => filter === "all" || pattern[1] === filter)
    .forEach(([name, group, description, force]) => {
      const card = document.createElement("article");
      card.className = "pattern-card";
      card.dataset.group = group;
      card.innerHTML = `
        <div class="pattern-top">
          <span class="glyph">${name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</span>
          <span class="tag">${group}</span>
        </div>
        <h3>${name}</h3>
        <p>${description}</p>
        <button type="button" data-pattern="${name}" data-force="${force}">Use in advisor</button>
      `;
      grid.append(card);
    });
}

function updateScenario(risk) {
  const scenario = scenarios[risk] || scenarios["Change frequency"];
  title.textContent = scenario.title;
  confidence.textContent = scenario.confidence;
  fitSummary.textContent = scenario.fit;
  watchSummary.textContent = scenario.watch;
  nextSteps.innerHTML = scenario.steps.map((step) => `<li>${step}</li>`).join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    renderPatterns(tab.dataset.filter);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateScenario(new FormData(form).get("risk"));
  document.querySelector(".results-band").scrollIntoView({ behavior: "smooth", block: "start" });
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-pattern]");
  if (!button) return;
  const goal = document.querySelector("#goal");
  goal.value = `Evaluate ${button.dataset.pattern} for a system where the main pressure is ${button.dataset.force}. Compare fit, risks, and a small migration plan.`;
  document.querySelector("#advisor").scrollIntoView({ behavior: "smooth", block: "start" });
});

function drawCanvas() {
  const canvas = document.querySelector("#patternCanvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfaf6";
  ctx.fillRect(0, 0, width, height);

  const nodes = [
    [128, 120, "#1f7a78"], [335, 92, "#d97745"], [560, 150, "#426f9f"], [780, 96, "#d2a84f"],
    [210, 320, "#426f9f"], [455, 282, "#1f7a78"], [706, 330, "#d97745"], [940, 260, "#1f7a78"],
    [156, 565, "#d2a84f"], [410, 525, "#d97745"], [650, 560, "#426f9f"], [900, 500, "#d2a84f"]
  ];

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(28, 37, 48, 0.22)";
  for (let index = 0; index < nodes.length - 1; index += 1) {
    const [x1, y1] = nodes[index];
    const [x2, y2] = nodes[index + 1];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo((x1 + x2) / 2, y1 - 70, (x1 + x2) / 2, y2 + 70, x2, y2);
    ctx.stroke();
  }

  nodes.forEach(([x, y, color], index) => {
    ctx.fillStyle = "rgba(255,255,255,0.86)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(x - 46, y - 30, 92, 60, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "800 20px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(index + 1).padStart(2, "0"), x, y);
  });
}

renderPatterns();
updateScenario("Change frequency");
drawCanvas();
