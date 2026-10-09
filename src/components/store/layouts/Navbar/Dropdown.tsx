"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { NavbarItem } from "./type";

type DropdownProps = { data: NavbarItem };

const Dropdown = ({ data }: DropdownProps) => {
    const [show, setShow] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setShow(true);
    };

    const handleMouseLeave = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = setTimeout(() => {
            setShow(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    if (data.type === "link") {
        return (
            <Link
                href={data.link.href}
                className="py-2 text-[13px] font-medium text-[#425347] transition-colors hover:text-[#2b6944]"
            >
                {data.link.name}
            </Link>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type="button"
                className="flex items-center gap-1.5 py-2 text-[13px] font-medium text-[#425347] transition-colors hover:text-[#2b6944]"
                aria-expanded={show}
                aria-haspopup="menu"
                onClick={() => setShow((visible) => !visible)}
            >
                {data.name}
                <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${
                        show ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                />
            </button>

            {show && (
                <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1.5">
                    <div
                        role="menu"
                        className="w-56 rounded-2xl border border-[#e8ece5] bg-white p-2 shadow-[0_16px_40px_-18px_rgba(22,51,33,0.3)] animate-in fade-in-0 zoom-in-95 duration-150"
                    >
                        <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8c998e]">
                            Explore {data.name.toLowerCase()}
                        </p>
                        {data.links.map((item) => (
                            <Link
                                href={item.href}
                                key={item.id}
                                role="menuitem"
                                onClick={() => setShow(false)}
                                className="block rounded-xl px-3 py-2.5 text-sm text-[#435448] transition-colors hover:bg-[#f3f6f1] hover:text-[#25563a]"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/shop"
                            onClick={() => setShow(false)}
                            className="mt-1 flex items-center justify-between rounded-xl border-t border-[#edf0eb] px-3 py-3 text-xs font-semibold text-[#386448]"
                        >
                            Shop all collections <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;