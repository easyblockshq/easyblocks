const pxKeys: { [key: string]: true } = {
  margin: true,
  marginTop: true,
  marginBottom: true,
  marginLeft: true,
  marginRight: true,
  m: true,
  mt: true,
  mb: true,
  ml: true,
  mr: true,
  mx: true,
  my: true,

  padding: true,
  paddingTop: true,
  paddingBottom: true,
  paddingLeft: true,
  paddingRight: true,
  p: true,
  pt: true,
  pb: true,
  pl: true,
  pr: true,
  px: true,
  py: true,

  top: true,
  bottom: true,
  left: true,
  right: true,

  flexBasis: true,
  gridColumnGap: true,
  gridRowGap: true,
};

function numericToPx(input: Record<string, any>) {
  const ret: Record<string, any> = {};

  for (const key in input) {
    if (pxKeys[key] && typeof input[key] === "number") {
      ret[key] = input[key] + "px";
    } else {
      ret[key] = input[key];
    }
  }

  return ret;
}

export const box = (styles: Record<string, any>, tag?: string) => {
  const ret = numericToPx(styles);
  ret.__isBox = true;

  if (tag) {
    ret.__as = tag;
  }
  return ret;
};
