type DashboardHeaderProps = {
  title: string;
  description: string;
};

export const DashboardHeader = ({ title, description }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm lg:text-base text-muted-foreground">{description}</p>
    </div>
  );
}; 