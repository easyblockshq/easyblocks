import { CompiledComponentConfigBase, DeviceRange } from "@easyblocks/core";
import { CompilationContextType } from "@easyblocks/app-utils";

export interface CompiledComponentStylesToolkit {
  /**
   * This breakpoint index is different from currently selected breakpoint index in editor.
   * It's current breakpoint index for which the compilation is happening.
   */
  compilationContext: CompilationContextType;
  $width: number;
  $widthAuto: boolean;
  device: DeviceRange;
}

export type Stylesheet = {
  [key: string]: any;
};

// TODO: this should live inside of react package
export type CompiledShopstoryComponentProps<
  Identifier extends string = string,
  StateProps extends Record<string, any> = Record<string, any>,
  ContextProps extends Record<string, any> = Record<string, any>,
  Styles extends Record<string, unknown> = Record<string, unknown>
> = {
  __fromEditor: CompiledComponentConfigBase<
    Identifier,
    StateProps & ContextProps
  > & {
    path: string;
    styled: Styles;
    components: {
      [key in keyof Styles]: React.ForwardRefRenderFunction<
        HTMLElement,
        Record<string, any>
      >;
    };
    runtime: any;
    __editing?: Record<string, any>;
  };
};
