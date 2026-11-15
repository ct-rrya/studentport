"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  MapPin,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { CTU_CAMPUSES } from "@/data/campuses";
import { useCampus } from "@/context/CampusContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/news", label: "News" },
  { href: "/campuses", label: "Campuses" },
  { href: "/programs", label: "Programs" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { selectedCampus, setSelectedCampus, setChatOpen } = useCampus();
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainCampuses = CTU_CAMPUSES.filter((c) => c.type === "main");
  const satelliteCampuses = CTU_CAMPUSES.filter((c) => c.type === "satellite");
  const extensionCampuses = CTU_CAMPUSES.filter((c) => c.type === "extension");

  return (
    <header className="sticky top-0 z-40 border-b border-[#EBD3AE] bg-[#FFF9EC]">
      {/* 4-segment warm palette strip form the redesign */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-[#FBA17E]" />
        <div className="flex-1 bg-[#F7D794]" />
        <div className="flex-1 bg-[#FF9A00]" />
        <div className="flex-1 bg-[#EE6200]" />
      </div>

      <div className="mx-auto flex h-[76px] max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-8">
        {/* brand logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo.png"
            alt="CTU Student Portal Logo"
            width={96}
            height={40}
            priority
            className="h-9 w-auto shrink-0 object-contain sm:h-10"
          />
          <div className="leading-tight">
            <span className="display block text-[17px] font-bold tracking-tight text-[#2A170B] sm:text-[19px]">
              CTU Student Portal
            </span>
            <span className="block text-[12px] text-[#6B4A33]">
              Cebu Technological University
            </span>
          </div>
        </Link>

        {/* desktop nav pills */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[15px] transition-colors ${
                  active
                    ? "bg-[#F7D794] font-bold text-[#2A170B]"
                    : "font-normal text-[#2A170B] hover:bg-[#F7D794]/65"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* campus dropdown + Ask CTU AI cta + mobile menu btn */}
        <div className="flex items-center gap-2.5">
          <div className="relative hidden items-center sm:flex">
            <MapPin className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#EE6200]" />
            <select
              aria-label="Filter portal by CTU campus"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="h-11 max-w-[205px] truncate rounded-[12px] border border-[#EBD3AE] bg-[#FFEFD0] pl-9 pr-8 text-[14px] font-medium text-[#2A170B] transition-colors hover:border-[#EE6200]/60 focus:border-[#EE6200] focus:outline-none"
            >
              <option value="all">All 29 Campuses</option>
              <optgroup label="Main Campus (1)">
                {mainCampuses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.shortName}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Satellite Campuses (16)">
                {satelliteCampuses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.shortName}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Extension Campuses (12)">
                {extensionCampuses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.shortName}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#F7D794] text-[#2A170B] transition-colors hover:bg-[#FF9A00] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* full-screen mobile drawer matching mobile-menu.html */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#FFF9EC] lg:hidden">
          <div className="flex h-[5px] w-full shrink-0">
            <div className="flex-1 bg-[#FBA17E]" />
            <div className="flex-1 bg-[#F7D794]" />
            <div className="flex-1 bg-[#FF9A00]" />
            <div className="flex-1 bg-[#EE6200]" />
          </div>

          <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-[#EBD3AE] px-5">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="CTU Student Portal Logo"
                width={76}
                height={32}
                className="h-8 w-auto shrink-0 object-contain"
              />
              <span className="display text-[17px] font-bold text-[#2A170B]">Menu</span>
            </div>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#F7D794] text-[#2A170B]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <div>
              <p className="mb-2 text-[11px] font-bold tracking-[0.07em] text-[#6B4A33] uppercase">
                Your campus
              </p>
              <div className="relative flex items-center">
                <MapPin className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#EE6200]" />
                <select
                  aria-label="Choose your CTU campus"
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="h-12 w-full rounded-[14px] border border-[#EBD3AE] bg-[#FFEFD0] pl-10 pr-8 text-[15px] font-bold text-[#2A170B] focus:border-[#EE6200] focus:outline-none"
                >
                  <option value="all">All 29 Campuses</option>
                  <optgroup label="Main Campus (1)">
                    {mainCampuses.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.shortName}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Satellite Campuses (16)">
                    {satelliteCampuses.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.shortName}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Extension Campuses (12)">
                    {extensionCampuses.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.shortName}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <nav className="space-y-1.5">
              {NAV_LINKS.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-[14px] px-4 py-3.5 text-[17px] transition-colors ${
                      active
                        ? "bg-[#F7D794] font-bold text-[#2A170B]"
                        : "text-[#2A170B] hover:bg-[#FFEFD0]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-[18px] w-[18px] text-[#6B4A33]" />
                  </Link>
                );
              })}
            </nav>

            <div className="rounded-[18px] border border-[#EBD3AE] bg-[#FFEFD0] p-4">
              <p className="mb-2.5 text-[11px] font-bold tracking-[0.07em] text-[#6B4A33] uppercase">
                Official CTU systems
              </p>
              <div className="space-y-2.5 text-[14px] font-medium text-[#2A170B]">
                <a
                  href="https://enrolment.ctu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#EE6200]"
                >
                  <span>CTU Enrolment</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#6B4A33]" />
                </a>
                <a
                  href="https://online.ctu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#EE6200]"
                >
                  <span>CTU Online LMS</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#6B4A33]" />
                </a>
                <a
                  href="https://www.ctu.edu.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between hover:text-[#EE6200]"
                >
                  <span>Official CTU website</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#6B4A33]" />
                </a>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-[#EBD3AE] px-5 py-4">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setChatOpen(true);
              }}
              className="inline-flex h-[50px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#FF9A00] text-[15px] font-bold text-[#2A170B]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Ask CTU AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
