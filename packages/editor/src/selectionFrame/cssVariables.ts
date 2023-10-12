function editorVariable<T extends string>(name: T): `--shopstory-editor-${T}` {
  return `--shopstory-editor-${name}`;
}

const BEFORE_ADD_BUTTON_DISPLAY = editorVariable("before-add-button-display");
const BEFORE_ADD_BUTTON_TOP = editorVariable("before-add-button-top");
const BEFORE_ADD_BUTTON_LEFT = editorVariable("before-add-button-left");

const AFTER_ADD_BUTTON_DISPLAY = editorVariable("after-add-button-display");
const AFTER_ADD_BUTTON_TOP = editorVariable("after-add-button-top");
const AFTER_ADD_BUTTON_LEFT = editorVariable("after-add-button-left");

export {
  BEFORE_ADD_BUTTON_DISPLAY,
  BEFORE_ADD_BUTTON_TOP,
  BEFORE_ADD_BUTTON_LEFT,
  AFTER_ADD_BUTTON_DISPLAY,
  AFTER_ADD_BUTTON_TOP,
  AFTER_ADD_BUTTON_LEFT,
};
