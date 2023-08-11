import { SupabaseClient } from "@supabase/supabase-js";

export async function updateMappingsForTemplate(
  templateId: string,
  masterTemplateIds: string[],
  supabase: SupabaseClient
) {
  const templateMappingsSelectResult = await supabase
    .from("template_mappings")
    .select();

  if (templateMappingsSelectResult.error) {
    console.error(templateMappingsSelectResult.error);
    return;
  }

  const existingTemplateMappings = templateMappingsSelectResult.data;

  // Find all current mappings of this template and null them first
  existingTemplateMappings
    .filter((x) => x.template_id === templateId)
    .forEach((x) => {
      x.template_id = null;
    });

  // Update or create new ones
  const newTempleMappings: any[] = [];
  masterTemplateIds.forEach((masterTemplateId) => {
    const existingMapping = existingTemplateMappings.find(
      (x) => x.master_id === masterTemplateId
    );
    if (existingMapping) {
      existingMapping.template_id = templateId;
    } else {
      newTempleMappings.push({
        template_id: templateId,
        master_id: masterTemplateId,
      });
    }
  });

  // Assign template mapping
  const updateExistingMappingsResult = await supabase
    .from("template_mappings")
    .upsert(existingTemplateMappings)
    .select();

  if (updateExistingMappingsResult.error) {
    console.error(updateExistingMappingsResult);
  }

  const insertNewMappingsResult = await supabase
    .from("template_mappings")
    .insert(newTempleMappings)
    .select();

  if (insertNewMappingsResult.error) {
    console.error(insertNewMappingsResult);
  }
}
