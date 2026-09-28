import { Spinner } from "#/ui/components/spinner";

export function FullPageSpinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Spinner className="size-8 text-primary" />
    </div>
  );
}
