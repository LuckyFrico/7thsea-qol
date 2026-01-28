// ============================================================================
// QOL – Descriptions enrichment
// ============================================================================
console.log("QOL ENRICH TEST");

Hooks.on("renderItemSheet", async (sheet, html, data) => {
  const desc = html.find(".editor-content[data-edit='system.description']");
  if (!desc.length) return;

  const raw = foundry.utils.getProperty(sheet.object, "system.description") ?? "";

  if (!raw) return;

  const enriched = await TextEditor.enrichHTML(raw, {
    secrets: false,
    documents: true,
    links: true,
    rolls: true
  });

  desc.html(enriched);
});
