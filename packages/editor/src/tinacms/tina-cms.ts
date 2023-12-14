/**

 Copyright 2019 Forestry.io Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

import { CMS, CMSConfig, Form, PluginType } from "@easyblocks/app-utils";
import {
  NumberFieldPlugin,
  RadioGroupFieldPlugin,
  SelectFieldPlugin,
  TextFieldPlugin,
  ToggleFieldPlugin,
} from "../tinacms/fields";
import { FieldPlugin } from "../tinacms/form-builder";
import { PositionFieldPlugin } from "./fields/plugins/PositionFieldPlugin";

const DEFAULT_FIELDS = [
  TextFieldPlugin,
  NumberFieldPlugin,
  ToggleFieldPlugin,
  SelectFieldPlugin,
  RadioGroupFieldPlugin,
  PositionFieldPlugin,
];

export type TinaCMSConfig = CMSConfig;

export class TinaCMS extends CMS {
  constructor(config: TinaCMSConfig = {}) {
    super(config);

    DEFAULT_FIELDS.forEach((field) => {
      if (!this.fields.find(field.name)) {
        this.fields.add(field);
      }
    });
  }

  registerApi(name: string, api: any) {
    super.registerApi(name, api);
  }

  get forms(): PluginType<Form> {
    return this.plugins.findOrCreateMap<Form & { __type: string }>("form");
  }

  get fields(): PluginType<FieldPlugin> {
    return this.plugins.findOrCreateMap("field");
  }
}
