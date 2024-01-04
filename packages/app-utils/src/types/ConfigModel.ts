import { ComponentConfig } from "@easyblocks/core";

export interface ConfigModel {
  id: string;
  parent_id: string | null;
  config: ComponentConfig;
  project_id: string;
  created_at: string;
}
