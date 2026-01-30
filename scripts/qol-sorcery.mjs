// ============================================================================
// 7th Sea – QoL: Sorceryes (Localized)
// ============================================================================

Hooks.on("renderActorSheet", async (sheet, html, data) => {
  const actor = sheet.actor;

  if (!["playercharacter", "hero"].includes(actor.type)) return;

  const isSorte = actor.items.some(i =>
    i.type === "sorcery" &&
    i.system?.sorctype?.toLowerCase?.() === "sorte"
  );
  if (!isSorte) return;

  const staffilate = actor.getFlag("7thsea-qol", "staffilate") ?? 0;

  const sorceryTab = html.find(".tab.sorcery");
  if (!sorceryTab.length) return;

  if (sorceryTab.find(".qol-sorte-staffilate").length) return;

  const title = game.i18n.localize("QOL.Sorte.Title");
  const rulesSummary = game.i18n.localize("QOL.Sorte.Rules.Summary");
  const rulesText = game.i18n.localize("QOL.Sorte.Rules.Text");

  const block = $(`
    <div class="qol-sorte-staffilate" style="margin-top: 1rem; padding: 0.5rem; border-top: 1px solid #999;">
      <h3 style="margin:0 0 0.5rem 0;">${title}</h3>

      <div class="staffilate-counter-wrapper" 
           style="display:flex; align-items:center; justify-content:center; gap:1rem;">

        <button class="staffilate-minus" 
                style="width:40px; height:40px; font-size:1.4em; font-weight:bold;">
          –
        </button>

        <div class="staffilate-counter" 
             style="font-size:2em; font-weight:bold; width:60px; text-align:center;">
          ${staffilate}
        </div>

        <button class="staffilate-plus" 
                style="width:40px; height:40px; font-size:1.4em; font-weight:bold;">
          +
        </button>

      </div>

      <details style="margin-top:0.5rem;">
        <summary style="cursor:pointer; font-weight:bold;">${rulesSummary}</summary>
        <p style="margin-top:0.3rem; font-size: 0.9em;">
          ${rulesText}
        </p>
      </details>
    </div>
  `);

  const list = sorceryTab.find("ol.items-list");
  list.after(block);

  const counterEl = block.find(".staffilate-counter");

  block.find(".staffilate-minus").on("click", async () => {
    let value = parseInt(counterEl.text());
    value = Math.max(0, value - 1);
    counterEl.text(value);
    await actor.setFlag("7thsea-qol", "staffilate", value);
  });

  block.find(".staffilate-plus").on("click", async () => {
    let value = parseInt(counterEl.text());
    value = value + 1;
    counterEl.text(value);
    await actor.setFlag("7thsea-qol", "staffilate", value);
  });
});
