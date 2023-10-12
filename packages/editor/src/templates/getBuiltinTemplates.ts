import { createClient, Entry } from "contentful";
import { isComponentConfig } from "@easyblocks/app-utils";
import { Template } from "../types";

export async function getBuiltInTemplates(
  isMaster: boolean
): Promise<Template[]> {
  const shouldUsePreview = isMaster;

  const contentfulClient = createClient({
    space: "blh4anz05qu1",
    accessToken: shouldUsePreview
      ? "2OqujCwpaLi_bz7mHNrFUthl2aidK0UgVeumw_2vlsc"
      : "lYW4u-PLH0lAAzFqWUwfSluHeC-jL1MF0XIoTYlXAjI",
    host: shouldUsePreview ? "preview.contentful.com" : undefined,
  });

  const entries = await contentfulClient.getEntries({
    content_type: "templatePicker",
    include: 5,
  });

  const fetchedTemplates: {
    section: Template[];
    card: Template[];
  } = {
    section: [],
    card: [],
  };

  const templatePickerFields = entries.items[0].fields as any;

  templatePickerFields.sectionCategories.forEach(
    (sectionCategoryEntry: Entry<any>) => {
      sectionCategoryEntry.fields.sections.forEach(
        (sectionEntry: Entry<any>) => {
          const template = entryToTemplate(
            sectionEntry,
            sectionCategoryEntry.fields.name
          );

          if (template) {
            fetchedTemplates.section.push(template);
          }
        }
      );

      if (isComponentConfig(sectionCategoryEntry.fields.empty)) {
        fetchedTemplates.section.push({
          config: sectionCategoryEntry.fields.empty,
          isGroupEmptyTemplate: true,
          group: sectionCategoryEntry.fields.name,
        });
      }
    }
  );

  templatePickerFields.cardCategories.forEach(
    (cardCategoryEntry: Entry<any>) => {
      cardCategoryEntry.fields.cards.forEach((cardEntry: Entry<any>) => {
        const template = entryToTemplate(
          cardEntry,
          cardCategoryEntry.fields.name
        );

        if (template) {
          fetchedTemplates.card.push(template);
        }
      });
    }
  );

  return [...fetchedTemplates.section, ...fetchedTemplates.card];
}

function entryToTemplate(
  entry: Entry<any>,
  group: string
): Template | undefined {
  const fields: any = entry.fields;

  const imageUrl = `https://${fields.image.fields.file.url}`;

  if (!isComponentConfig(fields.data)) {
    return;
  }
  return {
    id: entry.sys.id,
    label: fields.name,
    config: fields.data,
    previewImage: imageUrl,
    group: group,
  };
}
