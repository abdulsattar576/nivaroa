import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag } from "lucide-react";
import { Images } from "@/constant/Image";
import Drawer from "./Drawer";
import { buildNavbarData } from "./navbar";
import Dropdown from "./Dropdown";
import { getCachedCategories } from "@/features/categories/data/categories";

const Navbar = async () => {
  const { logo } = Images;
  const categories = await getCachedCategories();
  const navbarItems = buildNavbarData(categories);

  return (
    <>
      <div className="bg-[#153f32] px-4 py-2 text-center text-[10px] font-medium tracking-[0.14em] text-white/85 sm:text-[11px]">
        COMPLIMENTARY SHIPPING ON ORDERS OVER $75
      </div>
      <header className="sticky top-0 z-40 border-b border-[#e9ece5] bg-[#fbfcf8]/95 text-[#21362a] shadow-[0_4px_20px_-16px_rgba(28,52,36,0.28)] backdrop-blur-xl">
        <div className="mx-auto hidden h-[5.5rem] max-w-[1440px] items-center gap-8 px-7 lg:flex xl:px-12">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Nivaroa home">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#edf3ea] p-1.5 shadow-[0_2px_8px_-2px_rgba(23,76,58,0.18)] ring-1 ring-[#d4e2d3] transition-all duration-200 group-hover:scale-105 group-hover:bg-[#e4ede0]">
              <Image src={logo} alt="Nivaroa" width={36} height={36} className="size-8 object-contain" priority />
            </div>
            <span className="text-[1.3rem] font-semibold tracking-[0.16em] text-[#193225]">NIVAROA</span>
          </Link>

          <nav aria-label="Main navigation" className="flex flex-1 items-center justify-center gap-8 xl:gap-10">
            {navbarItems.map((item) => (
              <Dropdown key={item.type === "link" ? item.link.id : item.id} data={item} />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-xl text-[#35493b] transition-all duration-200 hover:bg-[#ebf2e8] hover:text-[#174c3a]"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative grid size-10 place-items-center rounded-xl text-[#35493b] transition-all duration-200 hover:bg-[#ebf2e8] hover:text-[#174c3a]"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 grid size-4.5 min-w-[18px] place-items-center rounded-full bg-[#1b4e3a] px-1 text-[10px] font-semibold text-white shadow-sm ring-2 ring-white">
                0
              </span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:hidden">
          <Drawer items={navbarItems} />
          <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5" aria-label="Nivaroa home">
            <div className="grid size-9 place-items-center rounded-xl bg-[#edf3ea] p-1 shadow-sm ring-1 ring-[#d4e2d3]">
              <Image src={logo} alt="Nivaroa" width={28} height={28} className="size-7 object-contain" priority />
            </div>
            <span className="text-[1.15rem] font-semibold tracking-[0.15em] text-[#193225]">NIVAROA</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              className="grid size-10 place-items-center rounded-xl text-[#35493b] transition hover:bg-[#ebf2e8]"
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative grid size-10 place-items-center rounded-xl text-[#35493b] transition hover:bg-[#ebf2e8]"
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 grid size-4.5 min-w-[18px] place-items-center rounded-full bg-[#1b4e3a] px-1 text-[10px] font-semibold text-white shadow-sm ring-2 ring-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;