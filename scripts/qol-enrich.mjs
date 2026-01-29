// ============================================================================
// 7th Sea – QoL: Enriched Descriptions for Items & Actors
// ============================================================================

/**
 * Enrich a specific editor-content block by reading the RAW text from the document
 * instead of the rendered HTML.
 */
async function enrichEditorContent(document, htmlElement, dataPath) {
  const raw = foundry.utils.getProperty(document, dataPath) ?? "";
  if (!raw) return;

  const enriched = await TextEditor.enrichHTML(raw, {
    secrets: false,
    documents: true,
    links: true,
    rolls: true
  });

  htmlElement.html(enriched);
}

// ============================================================================
// ITEM SHEETS
// ============================================================================
Hooks.on("renderItemSheet", async (sheet, html, data) => {
  const item = sheet.object;

  const desc = html.find(".editor-content[data-edit='system.description']");
  if (!desc.length) return;

  await enrichEditorContent(item, desc, "system.description");
});

// ============================================================================
// ACTOR SHEETS
// ============================================================================
Hooks.on("renderActorSheet", async (sheet, html, data) => {
  const actor = sheet.actor;

  const editors = html.find(".editor-content[data-edit^='system.']");
  if (!editors.length) return;

  for (const el of editors) {
    const $el = $(el);
    const path = $el.data("edit");
    if (!path) continue;

    await enrichEditorContent(actor, $el, path);
  }
});
