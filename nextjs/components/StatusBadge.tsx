import type { Status } from "@/types/artwork";

/** Available / Sold pill: colored dot + label. */
export function StatusBadge({ status }: { status: Status }) {
  const available = status === "available";
  const color = available ? "text-available" : "text-sold";
  const dot = available ? "bg-available" : "bg-sold";

  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      <span className={`font-mono text-sm font-medium ${color}`}>
        {available ? "Available" : "Sold"}
      </span>
    </span>
  );
}
