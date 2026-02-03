Hooks.on("renderActorSheet", async (sheet, html, data) => {
  const actor = sheet.actor;

  if (actor.type !== "playercharacter") return;

  const adv = actor.getFlag("7thsea-qol", "advancements") ?? 0;

  const headerFields = html.find(".header-fields .form-group.flex-group");
  if (!headerFields.length) return;

  if (headerFields.find(".qol-advancements").length) return;

  const label = game.i18n.localize("QOL.Advancements.Title");
  const hint = game.i18n.localize("QOL.Advancements.Hint");

  const block = $(`
  <div class="flex-group qol-advancements">
    <label for="qol-advancements" class="icon-label">
      <i class="fas fa-arrow-up" 
         data-tooltip="${hint}" 
         data-tooltip-direction="UP"></i>
    </label>
    <span class="twodigit advancements">
      <input id="qol-advancements"
             type="number"
             min="0"
             value="${adv}"
             class="advancements-input"
             style="width: 2.5em; text-align: center;">
    </span>
  </div>
`);

  const wealthBlock = headerFields.find(".wealth").closest(".flex-group");
  if (wealthBlock.length) {
    wealthBlock.after(block);
  } else {
    headerFields.append(block);
  }

  block.find(".advancements-input").on("change", async ev => {
    let value = parseInt(ev.target.value);
    if (isNaN(value) || value < 0) value = 0;

    await actor.setFlag("7thsea-qol", "advancements", value);
  });
});
