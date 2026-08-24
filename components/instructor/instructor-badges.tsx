import { Badge } from "@/components/ui/badge";
import { InstructorAssignmentState } from "@/lib/types";
import { cn } from "@/lib/utils";

export function InstructorStateBadge({
  state,
  className,
}: {
  state: InstructorAssignmentState;
  className?: string;
}) {
  const variant =
    state === "Confirmada"
      ? "success"
      : state === "Programada"
        ? "secondary"
        : "warning";

  return (
    <Badge variant={variant} className={cn(className)}>
      {state}
    </Badge>
  );
}
