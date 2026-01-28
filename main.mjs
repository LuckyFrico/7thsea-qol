// ============================================================================
// 7th Sea – Quality of Life Improvements
// File: main.mjs
// ============================================================================

import { TrackerApp } from "./scripts/tracker.mjs";
import "./scripts/qol-wounds.mjs";
import "./scripts/qol-enrich.mjs";  

export const QOL = {
  tracker: null
};

// ============================================================================
// INIT
// ============================================================================
Hooks.once("init", () => {
  console.log("7th Sea QOL | Initializing module…");
  game.qol7thsea = QOL;

  game.settings.register("7thsea-qol", "enableTracker", {
    name: game.i18n.localize("QOL.Settings.EnableTracker.Name"),
    hint: game.i18n.localize("QOL.Settings.EnableTracker.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("7thsea-qol", "enableWoundsWarning", {
    name: game.i18n.localize("QOL.Settings.EnableWounds.Name"),
    hint: game.i18n.localize("QOL.Settings.EnableWounds.Hint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("7thsea-qol", "trackedActors", {
    scope: "world",
    config: false,
    type: Array,
    default: []
  });

  game.settings.register("7thsea-qol", "enableVillainSkillRank", {
  name: game.i18n.localize("QOL.Settings.EnableVillainSkillRank.Name"),
  hint: game.i18n.localize("QOL.Settings.EnableVillainSkillRank.Hint"),
  scope: "world",
  config: true,
  type: Boolean,
  default: true
});

});

// ============================================================================
// READY
// ============================================================================
Hooks.once("ready", () => {
  console.log("7th Sea QOL | Module ready.");

  if (game.settings.get("7thsea-qol", "enableTracker")) {
    QOL.tracker = new TrackerApp();
    console.log("7th Sea QOL | Initiative Tracker activated.");
  } else {
    console.log("7th Sea QOL | Initiative Tracker disabled by settings.");
  }
});

// ============================================================================
// ADD BUTTON IN ACTOR DIRECTORY
// ============================================================================
Hooks.on("renderActorDirectory", (app, html) => {
  if (!game.settings.get("7thsea-qol", "enableTracker")) return;

  const jq = $(html);

  if (jq.find(".open-initiative-tracker").length) return;

  const btn = $(`
    <button class="open-initiative-tracker">
      <i class="fa-solid fa-fire"></i> ${game.i18n.localize("QOL.Tracker.Open")}
    </button>
  `);

  const toolboxRow = jq.find(".header-actions.action-buttons.flexrow").eq(1);
  toolboxRow.after(btn);

  btn.on("click", () => {
    game.qol7thsea.tracker.render(true);
  });
});

// ============================================================================
// AUTO-RELOAD 
// ============================================================================
let qolSettingsChanged = false;

Hooks.on("updateSetting", setting => {
  const key = setting?.key ?? setting;
  if (typeof key === "string" && key.startsWith("7thsea-qol")) {
    qolSettingsChanged = true;
  }
});

Hooks.on("closeSettingsConfig", () => {
  if (!qolSettingsChanged) return;
  qolSettingsChanged = false;

  ui.notifications.info("7th Sea QOL: reloading the world to apply the changes…");
  window.location.reload();
});

Hooks.on("renderChatMessage", (message, html) => {
  const btn = html.find(".initiative-tracker-add");
  if (!btn.length) return;

  btn.on("click", async ev => {
    ev.preventDefault();

    const actorId = ev.currentTarget.dataset.actor;
    const raises = parseInt(ev.currentTarget.dataset.raise) || 0;

    const actor = game.actors.get(actorId);
    if (!actor) return;

    const type = actor.type;

    if (type === "playercharacter" || type === "hero") {
      await actor.update({ "system.initiative": raises });
    }
    else if (type === "villain" || type === "monster") {
      await actor.setFlag("svnsea2e", "initiative", raises);
    }
    else if (type === "brute") {
      await actor.update({ "system.traits.strength.value": raises });
    }

    ui.notifications.info(
        game.i18n.format("QOL.Tracker.InitiativeSet", {
        name: actor.name,
        value: raises
    })
);

  });
});

Hooks.on("updateActor", (actor, data) => {
  const tracker = game.qol7thsea?.tracker;
  if (!tracker) return;

  if (tracker.rendered && tracker.trackedActors.includes(actor.id)) {
  tracker.render(false);
  }
});

// Villan abilitiy score
Hooks.on("renderActorSheet", (sheet, html, data) => {
  const actor = sheet.actor;
  if (actor.type !== "villain") return;

  if (!game.settings.get("7thsea-qol", "enableVillainSkillRank")) return;

  const strength = actor.system?.traits?.strength?.value ?? 0;
  const skillRank = Math.ceil(strength / 2);

  const villainyField = html.find(".villanyrank");
  if (!villainyField.length) return;

  if (html.find(".qol-villain-skillrank").length) return;

  const label = game.i18n.format("QOL.Villain.SkillRank.Label", { value: skillRank });
  const description = game.i18n.localize("QOL.Villain.SkillRank.Description");

  const tip = $(`
    <div class="qol-villain-skillrank" style="margin-top: 4px; margin-left: 4px; font-size: 14px">
      ${label}<br>
      <em style="font-size: 10px">${description}</em>
    </div>
  `);

  villainyField.closest(".form-group").after(tip);
});


