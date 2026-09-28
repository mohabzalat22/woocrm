import { CircleNotchIcon } from '@phosphor-icons/react';
import { cn } from 'cn';

function Spinner({
  className,
  ...props
}: React.ComponentProps<typeof CircleNotchIcon>) {
  return (
    <CircleNotchIcon
      role="status"
      aria-label="Loading"
      weight="bold"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
