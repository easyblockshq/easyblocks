export type Stylesheet = {
  [key: string]: any;
};

// TODO: this should live inside of react package
export type CompiledNoCodeComponentProps<
  Identifier extends string = string,
  StateProps extends Record<string, any> = Record<string, any>,
  ContextProps extends Record<string, any> = Record<string, any>,
  Styles extends Record<string, unknown> = Record<string, unknown>
> = {
  _template: Identifier;
  _id: string;
  path: string;
  runtime: any;
  isEditing: boolean;
} & StateProps & {
    [key in keyof Omit<Styles, "__props">]: React.ReactElement;
  } & ContextProps;
