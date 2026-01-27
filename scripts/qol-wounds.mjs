// ============================================================================
// QOL – Dramatic Wounds Warning for Approach Roll
// ============================================================================

console.log("QOL Wounds | File loaded");

// Titoli possibili del dialogo (IT + EN)
const APPROACH_TITLES = [
  "tiro di approccio",
  "approach roll"
];

Hooks.on("renderDialog", (app, html) => {
  if (!game.settings.get("7thsea-qol", "enableWoundsWarning")) return;
  const title = (app.title ?? "").toLowerCase();

  if (!APPROACH_TITLES.some(t => title.includes(t))) return;

  const bonusField = html.find("input[name='bonusDice']");
  if (!bonusField.length) return;


  const sheet = Object.values(ui.windows)
    .filter(w => w.actor)
    .sort((a, b) => b.appId - a.appId)[0];

  if (!sheet?.actor) return;

  aggiungiNotaFerite(sheet.actor, html);
});

function aggiungiNotaFerite(actor, html) {
  const bonusField = html.find("input[name='bonusDice']");
  if (!bonusField.length) return;

  let reminder = "";

  // ------------------------------------------------------------
  // HEROES
  // ------------------------------------------------------------
  if (actor.type === "hero" || actor.type === "playercharacter") {

    if (actor.system.dwounds.value >= 1) {
      reminder += game.i18n.localize("QOL.Wounds.HeroFirst") + "<br>";
    }

    if (actor.system.dwounds.value >= 3) {
      reminder += game.i18n.localize("QOL.Wounds.HeroThird") + "<br>";
    }
  }

  // ------------------------------------------------------------
  // VILLAINS & MONSTERS
  // ------------------------------------------------------------
  if (actor.type === "villain" || actor.type === "monster") {
    const heroes = game.actors.filter(a =>
      a.type === "hero" || a.type === "playercharacter"
    );

    const count = heroes.filter(h => h.system.dwounds.value >= 2).length;

    if (count > 0) {
      const bonus = count * 2;
      reminder += game.i18n.format("QOL.Wounds.VillainBonus", { bonus, count }) + "<br>";
    }
  }

  if (!reminder) return;

  const note = $(`
    <div style="font-size:12px; margin-top:6px; color:#b00; font-weight:bold;">
      ${reminder}
    </div>
  `);

  bonusField.closest(".form-group").after(note);
}
