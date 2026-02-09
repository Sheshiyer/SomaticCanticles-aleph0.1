import { PageLoader } from "../src/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <PageLoader size="xl" message="Loading page..." />
    </div>
  );
}
