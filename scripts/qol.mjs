// ============================================================================
// 7th Sea – Quality of Life Improvements
// File: qol.mjs
// ============================================================================

import { TrackerApp } from "./tracker.mjs";

export const QOL = {
  tracker: null,
  bruteSelector: null
};

// ============================================================================
// INIT
// ============================================================================
Hooks.once("init", () => {
  console.log("7th Sea QOL | module intitialization…");
  game.qol7thsea = QOL;

  // ------------------------------------------------------------
  // REGISTRAZIONE SETTING: lista attori tracciati nel tracker
  // ------------------------------------------------------------
  game.settings.register("7thsea-qol", "trackedActors", {
    scope: "world",
    config: false,
    type: Array,
    default: []
  });
});

// ============================================================================
// READY
// ============================================================================
Hooks.once("ready", () => {
  console.log("7th Sea QOL | Module ready.");

  // Inizializziamo le app
  QOL.tracker = new TrackerApp();
  QOL.bruteSelector = new BruteSelector();

  // Integrazioni chat
  registerChatIntegration();

  console.log("7th Sea QOL | Initiative Tracker activated.");
});

// ============================================================================
// AGGIUNGIAMO IL PULSANTE NEL TAB ATTORI
// ============================================================================
Hooks.on("renderActorDirectory", (app, html) => {
  const jq = $(html);

  // Evita duplicazioni
  if (jq.find(".open-initiative-tracker").length) return;

  const btn = $(`
  <button class="open-initiative-tracker">
    <i class="fa-solid fa-fire"></i> ${game.i18n.localize("QOL.Tracker.Open")}
  </button>
`);

  // Trova il div che contiene "Apri il toolbox"
  const toolboxRow = jq.find(".header-actions.action-buttons.flexrow").eq(1);

  // Inserisci il pulsante subito sotto
  toolboxRow.after(btn);

  // Listener
  btn.on("click", () => {
    game.qol7thsea.tracker.render(true);
  });
});



