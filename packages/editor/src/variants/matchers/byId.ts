import { ConfigComponent } from "@easyblocks/core";

const byId = (id: string) => (config: ConfigComponent) => config._id === id;

export { byId };
