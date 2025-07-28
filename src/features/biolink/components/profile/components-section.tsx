import { ComponentRenderer } from '@/features/biolink/components/page-builder/component-renderer';
import type { BiolinkComponent } from '@/features/biolink/types';

type ComponentsSectionProps = {
  components: BiolinkComponent[];
};

export const ComponentsSection = ({ components }: ComponentsSectionProps) => {
  const visibleComponents = components
    .filter(component => component.isVisible)
    .sort((a, b) => a.order - b.order);

  if (visibleComponents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {visibleComponents.map((component) => (
        <div key={component.id}>
          <ComponentRenderer component={component} isPreview={true} />
        </div>
      ))}
    </div>
  );
}; 