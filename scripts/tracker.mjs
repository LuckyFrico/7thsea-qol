// ============================================================================
// 7th Sea – Quality of Life Improvements
// File: tracker.mjs
// ============================================================================

export class TrackerApp extends Application {

  constructor(...args) {
    super(...args);

    // Carica la lista degli attori tracciati
    this.trackedActors = game.settings.get("7thsea-qol", "trackedActors") || [];
  }

  // ------------------------------------------------------------
  // Opzioni di default dell’applicazione
  // ------------------------------------------------------------
  static get defaultOptions() {
    return foundry.utils.mergeObject(
      super.defaultOptions,
      {
        id: "initiative-tracker-window",
        classes: ["initiative-tracker-window"],
        template: "modules/7thsea-qol/templates/initiative-tracker.hbs",
        popOut: true,
        resizable: true,
        minimizable: true,
        width: 420,
        height: "auto",
        title: "Tracker Iniziativa"
      },
      { overwrite: true }
    );
  }

  // ------------------------------------------------------------
  // Dati passati al template
  // ------------------------------------------------------------
  getData() {
    return {
      entries: this._getInitiativeEntries()
    };
  }

  // ------------------------------------------------------------
  // Costruzione della lista iniziativa
  // ------------------------------------------------------------
  _getInitiativeEntries() {

    // Usa SOLO gli attori tracciati
    const actors = this.trackedActors
      .map(id => game.actors.get(id))
      .filter(a => a);

    const typeMap = {
      playercharacter: "Giocatore",
      villain: "Malvagio",
      monster: "Mostro",
      brute: "Sgherri"
    };

    let entries = actors.map(a => {
      const type = a.type;
      const isPG = type === "playercharacter";
      const isVillain = type === "villain";
      const isMonster = type === "monster";
      const isBrute = type === "brute";

      let initiative = 0;

      // PG → system.initiative
      if (isPG) {
        initiative = a.system.initiative ?? 0;
      }

      // Villain / Monster → flag
      else if (isVillain || isMonster) {
        initiative = a.getFlag("svnsea2e", "initiative") ?? 0;
      }

      // Brute → iniziativa = forza
      else if (isBrute) {
        initiative = a.system.traits?.strength?.value ?? 0;
      }

      return {
        id: a.id,
        name: a.name,
        img: a.img,
        initiative,
        inactive: initiative === 0,
        isBrute,
        typeLabel: typeMap[type] ?? ""
      };
    });

    // Ordina: prima PG/Villain/Monster, poi Brute
    entries.sort((a, b) => {
      if (a.isBrute && !b.isBrute) return 1;
      if (!a.isBrute && b.isBrute) return -1;
      return b.initiative - a.initiative;
    });

    return entries;
  }

  // ------------------------------------------------------------
  // Listener UI
  // ------------------------------------------------------------
  activateListeners(html) {
    super.activateListeners(html);

    // ------------------------------------------------------------
    // Pulsanti +1 / -1
    // ------------------------------------------------------------
    html.find(".initiative-mod").click(async ev => {
      const btn = ev.currentTarget;
      const actorId = btn.dataset.actor;
      const delta = parseInt(btn.dataset.delta);

      const actor = game.actors.get(actorId);
      if (!actor) return;

      const type = actor.type;

      if (type === "playercharacter") {
        const updated = Math.max(0, (actor.system.initiative ?? 0) + delta);
        await actor.update({ "system.initiative": updated });
      }
      else if (type === "villain" || type === "monster") {
        const updated = Math.max(0, (actor.getFlag("svnsea2e", "initiative") ?? 0) + delta);
        await actor.setFlag("svnsea2e", "initiative", updated);
      }
      else if (type === "brute") {
        const strength = actor.system.traits?.strength?.value ?? 0;
        const updated = Math.max(0, strength + delta);
        await actor.update({ "system.traits.strength.value": updated });
      }

      this.render(true);
    });

    // ------------------------------------------------------------
    // Pulsante RIMOZIONE (X)
    // ------------------------------------------------------------
    html.find(".tracker-remove").click(async ev => {
      const id = ev.currentTarget.dataset.actor;

      const entry = html.find(`.tracker-entry[data-actor="${id}"]`);
      entry.addClass("removing");

      await new Promise(resolve => setTimeout(resolve, 250));

      this.trackedActors = this.trackedActors.filter(a => a !== id);
      await game.settings.set("7thsea-qol", "trackedActors", this.trackedActors);

      this.render(true);
    });

    // ------------------------------------------------------------
// RESET INCREMENTI (con popup di conferma)
// ------------------------------------------------------------
html.find(".tracker-reset-increments").click(async () => {

  new Dialog({
    title: "Conferma reset incrementi",
    content: `
      <p>Sei sicuro di voler continuare?</p>
      <p><strong>Saranno resettati tutti gli incrementi degli attori di gioco.</strong></p>
    `,
    buttons: {
      yes: {
        icon: '<i class="fas fa-check"></i>',
        label: "Sì",
        callback: async () => {

          for (const id of this.trackedActors) {
            const actor = game.actors.get(id);
            if (!actor) continue;

            const type = actor.type;

            if (type === "playercharacter") {
              await actor.update({ "system.initiative": 0 });
            }
            else if (type === "villain" || type === "monster") {
              await actor.setFlag("svnsea2e", "initiative", 0);
            }
            else if (type === "brute") {
              await actor.update({ "system.traits.strength.value": 0 });
            }
          }

          this.render(true);
        }
      },
      no: {
        icon: '<i class="fas fa-times"></i>',
        label: "No"
      }
    },
    default: "no"
  }).render(true);

});


    // ------------------------------------------------------------
    // RESET COMPLETO
    // ------------------------------------------------------------
    html.find(".tracker-reset-full").click(async () => {

  new Dialog({
    title: "Conferma reset completo",
    content: `
      <p>Sei sicuro di voler continuare?</p>
      <p><strong>Tutti gli attori verranno eliminati dal combat tracker e tutti gli incrementi saranno resettati.</strong></p>
    `,
    buttons: {
      yes: {
        icon: '<i class="fas fa-check"></i>',
        label: "Sì",
        callback: async () => {

          // Reset incrementi
          for (const id of this.trackedActors) {
            const actor = game.actors.get(id);
            if (!actor) continue;

            const type = actor.type;

            if (type === "playercharacter") {
              await actor.update({ "system.initiative": 0 });
            }
            else if (type === "villain" || type === "monster") {
              await actor.setFlag("svnsea2e", "initiative", 0);
            }
            else if (type === "brute") {
              await actor.update({ "system.traits.strength.value": 0 });
            }
          }

          // Svuota il tracker
          this.trackedActors = [];
          await game.settings.set("7thsea-qol", "trackedActors", []);

          this.render(true);
        }
      },
      no: {
        icon: '<i class="fas fa-times"></i>',
        label: "No"
      }
    },
    default: "no"
  }).render(true);

});

    // ------------------------------------------------------------
    // Abilita il DROP degli attori
    // ------------------------------------------------------------
    html[0].addEventListener("dragover", ev => ev.preventDefault());
    html[0].addEventListener("drop", this._onDrop.bind(this));
  }

  // ------------------------------------------------------------
  // Gestione del DROP
  // ------------------------------------------------------------
  async _onDrop(event) {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    if (data.type !== "Actor") return;

    const actor = await fromUuid(data.uuid);
    if (!actor) return;

    if (!this.trackedActors.includes(actor.id)) {
      this.trackedActors.push(actor.id);
      await game.settings.set("7thsea-qol", "trackedActors", this.trackedActors);
      this.render(true);
    }
  }
}
