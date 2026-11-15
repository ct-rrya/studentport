import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  lastSyncedAt?: string;
}

export function Footer({ lastSyncedAt }: FooterProps) {
  let formattedSync = "Server-cached institutional feed";
  if (lastSyncedAt) {
    const parsed = new Date(lastSyncedAt);
    if (!Number.isNaN(parsed.getTime())) {
      formattedSync = `Last synced ${parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
  }

  return (
    <footer className="mt-auto bg-[#2A170B] text-[#FFF9EC]">
      <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="CTU Student Portal Logo"
                width={86}
                height={36}
                className="h-9 w-auto shrink-0 object-contain"
              />
              <span className="display text-[17px] font-bold tracking-tight text-[#FFF9EC]">
                CTU Student Portal
              </span>
            </div>
            <p className="mt-3.5 max-w-[340px] text-[14px] leading-[1.6] text-[#E9D7B8]">
              An independent, student-built portal that organizes public announcements, campus
              details and academic offerings from{" "}
              <a
                href="https://www.ctu.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F7D794] underline underline-offset-2 hover:text-[#FFF9EC]"
              >
                ctu.edu.ph
              </a>
              .
            </p>
          </div>

          <div>
            <h3 className="text-[12px] font-bold tracking-[0.07em] text-[#F7D794] uppercase">
              Portal sections
            </h3>
            <ul className="mt-3.5 space-y-2.5 text-[14px]">
              <li>
                <Link href="/news" className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]">
                  News and announcements
                </Link>
              </li>
              <li>
                <Link href="/campuses" className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]">
                  29 campuses directory
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]">
                  Academic programs
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]">
                  Student systems and memos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]">
                  About and sync status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-bold tracking-[0.07em] text-[#F7D794] uppercase">
              Official CTU systems
            </h3>
            <ul className="mt-3.5 space-y-2.5 text-[14px]">
              <li>
                <a
                  href="https://enrolment.ctu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]"
                >
                  CTU Enrolment Portal
                </a>
              </li>
              <li>
                <a
                  href="https://online.ctu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]"
                >
                  CTU Online Learning (LMS)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ctu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFF9EC] transition-colors hover:text-[#F7D794]"
                >
                  Official CTU website
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-col items-start justify-between gap-2 border-t border-[#5A3A22] pt-5 text-[13px] text-[#E9D7B8] sm:flex-row sm:items-center">
          <p>
            Not an official CTU administration website. Every announcement links back to its{" "}
            <a
              href="https://www.ctu.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F7D794] underline underline-offset-2 hover:text-[#FFF9EC]"
            >
              original source on ctu.edu.ph
            </a>
            .
          </p>
          <p className="shrink-0">
            {lastSyncedAt ? (
              <>
                Last Synced from ctu.edu.ph:{" "}
                <time dateTime={lastSyncedAt}>{formattedSync.replace(/^Last synced\s*/i, "")}</time>
              </>
            ) : (
              formattedSync
            )}
          </p>
        </div>
      </div>

      {/* matching bottom 4-segment bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#FBA17E]" />
        <div className="flex-1 bg-[#F7D794]" />
        <div className="flex-1 bg-[#FF9A00]" />
        <div className="flex-1 bg-[#EE6200]" />
      </div>
    </footer>
  );
}
