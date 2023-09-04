import type { IApiClient } from "@easyblocks/core";

type Project = {
  id: string;
  name: string;
  tokens: Array<string>;
};

class ProjectsApiService {
  constructor(private readonly apiClient: IApiClient) {
    this.apiClient = apiClient;
  }

  async getProjects() {
    const response = await this.apiClient.get("/projects");

    if (response.ok) {
      return (await response.json()) as Array<Project>;
    }

    return [];
  }
}

export { ProjectsApiService };
export type { Project };
