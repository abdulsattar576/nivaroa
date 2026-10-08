import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag } from "lucide-react";
import { Images } from "@/constant/Image";
import Drawer from "./Drawer";
import { NavbarData } from "./navbar";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const { logo } = Images;

  return (
    <>
      <div className="bg-[#153f32] px-4 py-2 text-center text-[10px] font-medium tracking-[0.14em] text-white/85 sm:text-[11px]">
        COMPLIMENTARY SHIPPING ON ORDERS OVER $75
      </div>
      <header className="sticky top-0 z-40 border-b border-[#e9ece5] bg-[#fbfcf8]/95 text-[#21362a] shadow-[0_4px_20px_-16px_rgba(28,52,36,0.28)] backdrop-blur-xl">
        <div className="mx-auto hidden h-[5.5rem] max-w-[1440px] items-center gap-8 px-7 lg:flex xl:px-12">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Nivaroa home">
            <Image src={logo} alt="Nivaroa" width={46} height={46} className="size-11 object-contain" priority />
            <span className="text-[1.3rem] font-semibold tracking-[0.16em]">NIVAROA</span>
          </Link>

          <nav aria-label="Main navigation" className="flex flex-1 items-center justify-center gap-8 xl:gap-10">
            {NavbarData.map((item) => (
              <Dropdown key={item.type === "link" ? item.link.id : item.id} data={item} />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button type="button" aria-label="Search" className="grid size-10 place-items-center rounded-full text-[#3e5144] transition hover:bg-[#eff3ec] hover:text-[#174c3a]">
              <Search className="size-[19px]" aria-hidden="true" />
            </button>
            <Link href="/cart" aria-label="Shopping bag" className="relative grid size-10 place-items-center rounded-full text-[#3e5144] transition hover:bg-[#eff3ec] hover:text-[#174c3a]">
              <ShoppingBag className="size-[19px]" aria-hidden="true" />
              <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-[#315e43] text-[9px] font-semibold text-white">0</span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex h-[4.25rem] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:hidden">
          <Drawer />
          <Link href="/" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2" aria-label="Nivaroa home">
            <Image src={logo} alt="" width={34} height={34} className="size-[34px] object-contain" priority />
            <span className="text-[1.1rem] font-semibold tracking-[0.15em]">NIVAROA</span>
          </Link>
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Search" className="grid size-10 place-items-center rounded-full text-[#3e5144] hover:bg-[#eff3ec]">
              <Search className="size-[19px]" aria-hidden="true" />
            </button>
            <Link href="/cart" aria-label="Shopping bag" className="relative grid size-10 place-items-center rounded-full text-[#3e5144] hover:bg-[#eff3ec]">
              <ShoppingBag className="size-[19px]" aria-hidden="true" />
              <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-[#315e43] text-[9px] font-semibold text-white">0</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;