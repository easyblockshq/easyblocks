export function splitTemplateName(templateName: string): {
  name: string;
  ref?: string;
  isRefLocal?: boolean;
} {
  const [name, ref] = templateName.split("$$$");

  if (!ref) {
    return { name };
  }

  const refSplit = ref.split("local.");

  if (refSplit.length > 1) {
    return {
      name,
      ref: refSplit[1],
      isRefLocal: true,
    };
  }

  return {
    name,
    ref,
    isRefLocal: false,
  };
}
