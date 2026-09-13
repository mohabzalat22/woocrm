import { cn } from "cn";

interface Tag {
  name: string;
  className: string;
}

export default function Tag({ name, className }: Tag) {
  return (
    <span className={cn("text-xs rounded-full p-1.5", className)}> {name}</span>
  );
}
