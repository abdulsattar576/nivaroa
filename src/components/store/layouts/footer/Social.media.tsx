import { socialData } from "./footer";

const SocialMedia = () => {
    return (
        <address className="not-italic">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d5dfce]">Say hello</h3>
            <div className="mt-4 space-y-3">
                {socialData.map(({ icon: Icon, value }) => (
                    <a
                        key={value}
                        href={value.includes("@") ? `mailto:${value}` : `tel:${value}`}
                        className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
                    >
                        <Icon className="size-4 text-[#c3d6b5]" aria-hidden="true" />
                        {value}
                    </a>
                ))}
            </div>
        </address>
    );
};

export default SocialMedia;