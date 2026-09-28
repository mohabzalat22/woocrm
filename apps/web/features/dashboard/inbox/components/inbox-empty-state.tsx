interface InboxEmptyStateProps {
  searching: boolean;
}

export default function InboxEmptyState({ searching }: InboxEmptyStateProps) {
  return (
    <div className="px-5 py-14 text-center">
      <p className="text-sm font-medium">
        {searching ? "No matching conversations" : "No conversations here"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {searching
          ? "Try a different contact name."
          : "New conversations will appear in this tab."}
      </p>
    </div>
  );
}
