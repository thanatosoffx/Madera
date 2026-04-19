import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="container grid gap-10 py-16 md:grid-cols-2">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-10 w-40" />
      </div>
    </section>
  );
}
