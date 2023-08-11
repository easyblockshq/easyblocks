import { ProjectsRepository } from "./ProjectsRepository";

class ProjectIdResolver {
  constructor(private readonly projectsRepository: ProjectsRepository) {}

  async resolve(projectId: string) {
    if (projectId === "demo") {
      const project = await this.projectsRepository.getByType(projectId);
      return project.id;
    }

    return projectId;
  }
}

export { ProjectIdResolver };
