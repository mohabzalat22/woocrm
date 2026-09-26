import { Button } from "@repo/ui/ui/button";

type ContactsPaginationProps = {
  page: number;
  total: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
};

export function ContactsPagination({
  page,
  total,
  totalPages,
  onPrevious,
  onNext,
}: ContactsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        {total} contact{total === 1 ? "" : "s"}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
