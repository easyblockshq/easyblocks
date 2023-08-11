import { ConfigComponent } from "@easyblocks/core";

export interface ConfigModel {
  id: string;
  parent_id: string | null;
  config: ConfigComponent;
  project_id: string;
  created_at: string;
}
