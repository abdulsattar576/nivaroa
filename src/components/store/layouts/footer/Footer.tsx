import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Leaf } from "lucide-react";
import { Images } from "@/constant/Image";
import { footersection } from "./footer";
import SocialMedia from "./Social.media";

const Footer = () => {
    const { logo } = Images;

    return (
        <footer className="mt-auto bg-[#173e31] text-white">
            <div className="mx-auto max-w-[1440px] px-5 pb-7 pt-12 sm:px-8 sm:pt-16 lg:px-12">
                <div className="mb-10 grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[1.3fr_0.8fr] lg:items-center lg:gap-16 lg:pb-12">
                    <div className="max-w-xl">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c3d6b5]">
                            <Leaf className="size-3.5" aria-hidden="true" /> Considered living
                        </span>
                        <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
                            Good things for the everyday.
                        </h2>
                        <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
                            Thoughtfully selected pieces, made to feel right at home in your life.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[0.06] p-4 sm:p-5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#d2dfc5] text-[#31563c]">
                            <Leaf className="size-5" aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-white">Shop with intention</p>
                            <p className="mt-1 text-xs leading-5 text-white/60">Discover the collection, one good find at a time.</p>
                        </div>
                        <Link href="/shop" aria-label="Explore the shop" className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
                            <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.95fr] lg:gap-10">
                    <div className="max-w-sm">
                        <Link href="/" className="inline-flex items-center gap-3" aria-label="Nivaroa home">
                            <Image src={logo} alt="Nivaroa" width={48} height={48} className="size-12 object-contain" />
                            <span className="text-lg font-semibold tracking-[0.16em]">NIVAROA</span>
                        </Link>
                        <p className="mt-4 text-sm leading-6 text-white/60">
                            A considered collection for the things you use, wear, and live with every day.
                        </p>
                        <div className="mt-5">
                            <SocialMedia />
                        </div>
                    </div>

                    {footersection.map(({ heading, links }) => (
                        <nav key={heading} aria-label={`${heading} links`}>
                            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d5dfce]">{heading}</h3>
                            <ul className="mt-4 space-y-3">
                                {links.map(({ name, link }) => (
                                    <li key={name}>
                                        <Link href={link} className="text-sm text-white/60 transition-colors hover:text-white">{name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="mt-11 flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} Nivaroa. All rights reserved.</p>
                    <p className="flex items-center gap-1.5"><Leaf className="size-3.5 text-[#c3d6b5]" aria-hidden="true" /> Made for everyday living</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;