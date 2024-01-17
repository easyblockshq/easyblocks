type EditorSearchParams = {
  readOnly: boolean | null;
  documentId: string | null;
  documentType: string | null;
  locale: string | null;
  preview: boolean;
};

export function parseQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);

  const readOnly =
    searchParams.get("readOnly") === "true"
      ? true
      : searchParams.get("readOnly") === "false"
      ? false
      : null;
  const documentId = searchParams.get("documentId");
  const documentType = searchParams.get("documentType");
  const locale = searchParams.get("locale");

  const preview = searchParams.get("preview") === "true";

  const editorSearchParams: EditorSearchParams = {
    readOnly,
    documentId,
    documentType,
    locale,
    preview,
  };

  return editorSearchParams;
}
