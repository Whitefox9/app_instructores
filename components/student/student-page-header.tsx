import type { LucideIcon } from "lucide-react";

type StudentPageHeaderProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function StudentPageHeader({ title, description, icon: Icon }: StudentPageHeaderProps) {
  return (
    <header className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-[#202632] sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#667085] sm:text-base">{description}</p>
      </div>
    </header>
  );
}
