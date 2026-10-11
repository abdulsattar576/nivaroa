"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "./search-modal";

export function SearchButton({ isMobile = false }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Search Catalog"
        onClick={() => setIsOpen(true)}
        className={
          isMobile
            ? "grid size-9 place-items-center rounded-xl text-[#35493b] transition hover:bg-[#ebf2e8]"
            : "grid size-10 place-items-center rounded-xl text-[#35493b] transition-all duration-200 hover:bg-[#ebf2e8] hover:text-[#174c3a]"
        }
      >
        <Search className={isMobile ? "size-4.5" : "size-5"} aria-hidden="true" />
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

