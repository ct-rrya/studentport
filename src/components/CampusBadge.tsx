import Link from "next/link";
import { getCampusBySlug } from "@/data/campuses";
import { CampusType } from "@/types/portal";

export function CampusTypeBadge({ type }: { type: CampusType }) {
  // match the warm palette pills from the redesign
  const styles: Record<CampusType, string> = {
    main: "bg-[#EE6200] text-[#FFF9EC]",
    satellite: "bg-[#F7D794] text-[#2A170B]",
    extension: "bg-[#FBA17E] text-[#2A170B]",
  };

  const labels: Record<CampusType, string> = {
    main: "Main Campus",
    satellite: "Satellite",
    extension: "Extension",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-[0.04em] uppercase ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

export function CampusTagBadge({
  slug,
  clickable = true,
}: {
  slug: string;
  clickable?: boolean;
}) {
  const campus = getCampusBySlug(slug);
  if (!campus) return null;

  const badgeClass =
    "inline-flex items-center gap-1.5 rounded-full bg-[#FFEFD0] px-2.5 py-1 text-[12px] font-medium text-[#2A170B] transition-colors hover:bg-[#F7D794]";

  if (!clickable) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEFD0] px-2.5 py-1 text-[12px] font-medium text-[#2A170B]">
        {campus.shortName}
      </span>
    );
  }

  return (
    <Link href={`/campuses/${campus.slug}`} className={badgeClass}>
      {campus.shortName}
    </Link>
  );
}
