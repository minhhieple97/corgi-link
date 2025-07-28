import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { BiolinkProject, BiolinkProfile } from '@/features/biolink/types';

type ProjectsSectionProps = {
  projects: BiolinkProject[];
  profile: BiolinkProfile;
};

export const ProjectsSection = ({ projects, profile }: ProjectsSectionProps) => {
  const featuredProjects = projects
    .filter(project => project.isVisible && project.isFeatured)
    .sort((a, b) => a.order - b.order);

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-6 text-center">Featured Projects</h2>
      <div className="space-y-4">
        {featuredProjects.map((project) => (
          <div 
            key={project.id}
            className="border rounded-lg p-4 space-y-3"
            style={{ borderColor: profile.accentColor || '#e5e5e5' }}
          >
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-32 object-cover rounded-md"
              />
            )}
            <h3 className="font-semibold">{project.title}</h3>
            {project.description && (
              <p className="text-sm opacity-80">{project.description}</p>
            )}
            {project.technologies && (
              <div className="flex gap-2 flex-wrap">
                {JSON.parse(project.technologies).map((tech: string) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: profile.accentColor || '#3b82f6',
                      color: profile.backgroundColor || '#ffffff',
                      opacity: 0.8,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              {project.projectUrl && (
                <Button size="sm" variant="outline" asChild>
                  <a 
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3 mr-1" />
                    View Project
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button size="sm" variant="ghost" asChild>
                  <a 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 