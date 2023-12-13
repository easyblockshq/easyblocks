import type { UserDefinedTemplate, IApiClient } from "@easyblocks/core";

export async function getRemoteUserTemplates(
  apiClient: IApiClient,
  projectId: string
): Promise<UserDefinedTemplate[]> {
  try {
    const response = await apiClient.get(`/projects/${projectId}/templates`);
    const data: Array<any> = await response.json();

    const templates = data.map<UserDefinedTemplate>((item) => ({
      id: item.id,
      label: item.label,
      entry: item.config.config,
      isUserDefined: true,
      // configId: item.config.id,
      // mapTo: item.mapTo,
      // group: "My library",
      // isRemoteUserDefined: true,
      // previewSettings: {
      //   width: item.width,
      //   widthAuto: item.widthAuto,
      // },
    }));

    return templates;
  } catch (error) {
    console.error(error);
    return [];
  }
}
