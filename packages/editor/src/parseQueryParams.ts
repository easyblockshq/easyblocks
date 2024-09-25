interface EditorSearchParams {
  readOnly: boolean | null;
  documentId: string | null;
  templateId: string | null;
  rootComponentId: string | null;
  rootTemplateId: string | null;
  locale: string | null;
  preview: boolean;
  debug: boolean;
}

export function parseQueryParams(strSearch = window.location.search) {
  const searchParams = new URLSearchParams(strSearch);

  const readOnly =
    searchParams.get("readOnly") === "true"
      ? true
      : searchParams.get("readOnly") === "false"
      ? false
      : null;
  const documentId = searchParams.get("document");
  const templateId = searchParams.get("template");
  const rootComponentId = searchParams.get("rootComponent");
  const rootTemplateId = searchParams.get("rootTemplate");
  const locale = searchParams.get("locale");
  const debug = searchParams.get("debug") === "true";

  const preview = searchParams.get("preview") === "true";

  const editorSearchParams: EditorSearchParams = {
    readOnly,
    documentId,
    templateId,
    rootComponentId,
    rootTemplateId,
    locale,
    preview,
    debug,
  };

  return editorSearchParams;
}
