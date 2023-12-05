function getAbsoluteRichTextPartPath(
  relativeRichTextPartPath: string,
  richTextPath: string,
  locale: string
) {
  return `${richTextPath}.elements.${locale}.${relativeRichTextPartPath}`;
}

export { getAbsoluteRichTextPartPath };
