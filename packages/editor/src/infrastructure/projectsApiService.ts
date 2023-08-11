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

  async getProjectById(projectId: string): Promise<Project | null> {
    const response = await this.apiClient.get(`/projects/${projectId}`);

    if (response.ok) {
      const project = await response.json();
      return project;
    }

    return null;
  }

  /**
   * @deprecated
   */
  async getProjectByAccessToken(token: string) {
    return this.apiClient.get(`/projects/${token}`);
  }

  async createToken(
    projectId: string
  ): Promise<{ token: Project["tokens"][number] }> {
    const response = await this.apiClient.post(`/projects/${projectId}/tokens`);
    const newTokenData = await response.json();
    return newTokenData;
  }
}

export { ProjectsApiService };
export type { Project };
