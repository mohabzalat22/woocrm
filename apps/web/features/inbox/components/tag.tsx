interface Tag {
  name: string;
  className: string;
}

export default function Tag({ name, className }: Tag) {
  return <span className={className}> {name}</span>;
}
