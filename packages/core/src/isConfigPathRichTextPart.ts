const RICH_TEXT_PART_CONFIG_PATH_REGEXP =
  /\.elements\.[a-z(\-_A-Z)?]+\.\d+(\.elements\.\d+){2,3}(\.\{\d+,\d+\})?$/;

function isConfigPathRichTextPart(configPath: string): boolean {
  return RICH_TEXT_PART_CONFIG_PATH_REGEXP.test(configPath);
}

export { isConfigPathRichTextPart, RICH_TEXT_PART_CONFIG_PATH_REGEXP };
