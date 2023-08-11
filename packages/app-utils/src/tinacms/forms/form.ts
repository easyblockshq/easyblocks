import { dotNotationGet } from "@easyblocks/utils";
import { Config, createForm, FormApi, FormState, FORM_ERROR } from "final-form";
import arrayMutators from "final-form-arrays";
import { InternalAnyField, InternalField } from "../../schema";
import { Plugin } from "../core";

export interface FormOptions<S, F extends InternalField = InternalAnyField>
  extends Config<S> {
  id: any;
  label: string;
  fields?: F[];
  __type?: string;
  reset?(): void;
  actions?: any[];
  buttons?: {
    save: string;
    reset: string;
  };
  loadInitialValues?: () => Promise<S>;
  onChange?(values: FormState<S>): void;
}

export class Form<
  S extends Record<string, any> = any,
  F extends InternalField = InternalAnyField
> implements Plugin
{
  private _reset?(): void;

  __type: string;
  id: any;
  label: string;
  fields: F[];
  finalForm: FormApi<S>;
  actions: any[];
  buttons: {
    save: string;
    reset: string;
  };
  loading = false;

  constructor({
    id,
    label,
    fields,
    actions,
    buttons,
    reset,
    loadInitialValues,
    onChange,
    ...options
  }: FormOptions<S, F>) {
    const initialValues = options.initialValues || ({} as S);
    this.__type = options.__type || "form";
    this.id = id;
    this.label = label;
    this.fields = fields || [];
    this.onSubmit = options.onSubmit;
    this.finalForm = createForm<S>({
      ...options,
      initialValues,
      onSubmit: this.handleSubmit,
      mutators: {
        ...arrayMutators,
        ...options.mutators,
      },
    });

    this._reset = reset;
    this.actions = actions || [];
    this.buttons = buttons || {
      save: "Save",
      reset: "Reset",
    };
    this.updateFields(this.fields);

    if (loadInitialValues) {
      this.loading = true;
      loadInitialValues()
        .then((initialValues) => {
          this.updateInitialValues(initialValues);
        })
        .finally(() => {
          this.loading = false;
        });
    }

    if (onChange) {
      let firstUpdate = true;
      this.subscribe(
        (formState) => {
          if (firstUpdate) {
            firstUpdate = false;
          } else {
            onChange(formState);
          }
        },
        { values: true }
      );
    }
  }

  /**
   * A unique identifier for Forms.
   *
   * @alias id
   */
  get name() {
    return this.id;
  }

  /**
   * Returns the current values of the form.
   *
   * if the form is still loading it returns `undefined`.
   */
  get values(): S | undefined {
    if (this.loading) {
      return undefined;
    }
    return this.finalForm.getState().values || (this.initialValues as S);
  }

  /**
   * The values the form was initialized with.
   */
  get initialValues() {
    return this.finalForm.getState().initialValues;
  }

  get pristine() {
    return this.finalForm.getState().pristine;
  }

  get dirty() {
    return this.finalForm.getState().dirty;
  }

  get submitting() {
    return this.finalForm.getState().submitting;
  }

  get valid() {
    return this.finalForm.getState().valid;
  }

  /**
   * Resets the values back to the initial values the form was initialized with.
   * Or empties all the values if the form was not initialized.
   */
  async reset() {
    if (this._reset) {
      await this._reset();
    }
    this.finalForm.reset();
  }

  /**
   * @deprecated Unnecessary indirection
   */
  updateFields(fields: F[]) {
    this.fields = fields;
  }

  /**
   * Subscribes to changes to the form. The subscriber will only be called when
   * values specified in subscription change. A form can have many subscribers.
   */
  subscribe: FormApi<S>["subscribe"] = (cb, options) => {
    return this.finalForm.subscribe(cb, options);
  };

  onSubmit: Config<S>["onSubmit"];

  private handleSubmit: Config<S>["onSubmit"] = async (values, form, cb) => {
    try {
      const response = await this.onSubmit(values, form, cb);
      form.initialize(values);
      return response;
    } catch (error) {
      return { [FORM_ERROR]: error };
    }
  };

  /**
   * Submits the form if there are currently no validation errors. It may
   * return undefined or a Promise depending on the nature of the onSubmit
   * configuration value given to the form when it was created.
   */
  submit: FormApi<S>["submit"] = () => {
    return this.finalForm.submit();
  };

  /**
   * Changes the value of the given field.
   *
   * @param name
   * @param value
   */
  change(name: string, value?: any) {
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed("Change to", name === "" ? '""' : `"${name}"`);
      console.log("Old config", this.values);
      console.log("Old value", dotNotationGet(this.values, name));
      this.finalForm.change(name as keyof S, value);
      console.log("New config", this.values);
      console.log("New value", value);
      console.groupEnd();
      return;
    }

    return this.finalForm.change(name as keyof S, value);
  }

  get mutators() {
    return this.finalForm.mutators;
  }

  /**
   * Updates multiple fields in the form.
   *
   * The updates are batched so that it only triggers one `onChange` event.
   *
   * In order to prevent disruptions to the user's editing experience this
   * function will _not_ update the value of any field that is currently
   * being edited.
   *
   * @param values
   */
  updateValues(values: S) {
    this.finalForm.batch(() => {
      const activePath: any = this.finalForm.getState().active;

      if (!activePath) {
        updateEverything<S>(this.finalForm, values);
      } else {
        updateSelectively<S>(this.finalForm, values);
      }
    });
  }

  /**
   * Replaces the initialValues of the form without deleting the current values.
   *
   * This function is helpful when the initialValues are loaded asynchronously.
   *
   * @param initialValues
   */
  updateInitialValues(initialValues: S) {
    this.finalForm.batch(() => {
      const values = this.values || ({} as S);
      this.finalForm.initialize(initialValues);
      const activePath: any = this.finalForm.getState().active;

      if (!activePath) {
        updateEverything<S>(this.finalForm, values);
      } else {
        updateSelectively<S>(this.finalForm, values);
      }
    });
  }
}

function updateEverything<S extends Record<string, any>>(
  form: FormApi<any>,
  values: S
) {
  Object.entries(values).forEach(([path, value]) => {
    form.change(path, value);
  });
}

function updateSelectively<S extends Record<string, any>>(
  form: FormApi<any>,
  values: S,
  prefix?: string
) {
  const activePath: any = form.getState().active!;

  Object.entries(values).forEach(([name, value]) => {
    const path = prefix ? `${prefix}.${name}` : name;

    if (typeof value === "object") {
      if (activePath.startsWith(path)) {
        updateSelectively(form, value, path);
      } else {
        form.change(path, value);
      }
    } else if (path !== activePath) {
      form.change(path, value);
    }
  });
}
