import { socialData } from "./footer";

const SocialMedia = () => {
    return (
        <address className="not-italic">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d5dfce]">Say hello</h3>
            <div className="mt-4 space-y-2.5">
                {socialData.map(({ icon: Icon, value }) => (
                    <a
                        key={value}
                        href={value.includes("@") ? `mailto:${value}` : `tel:${value}`}
                        className="group flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-white"
                    >
                        <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-white/15 bg-white/[0.08] text-[#c3d6b5] transition-all duration-150 group-hover:border-white/30 group-hover:bg-white/20 group-hover:text-white">
                            <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span>{value}</span>
                    </a>
                ))}
            </div>
        </address>
    );
};

export default SocialMedia;