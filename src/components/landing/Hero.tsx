type HeroCopy = {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    lead: {
        line1: string;
        strong: string;
        line2: string;
    };
};

export default function Hero({ copy }: { copy: HeroCopy }) {
    return (
        <section className="container section text-center">
            {/* Logo */}
            <div className="mb-10 flex justify-center">
                <div className="ids-logo-wrap">
                    <img
                        src="/logo.png"
                        alt="Intent Design System"
                        className="ids-logo-img"
                        draggable={false}
                    />
                </div>
            </div>

            {/* Eyebrow */}
            <p className="mb-6 text-xs tracking-[0.35em] uppercase text-dim">{copy.eyebrow}</p>

            {/* Title */}
            <h1 className="mx-auto max-w-3xl">
                {copy.titleLine1}
                <br />
                <span className="opacity-70">{copy.titleLine2}</span>
            </h1>

            {/* Divider */}
            <div className="mx-auto mt-8 h-px w-16 bg-white/10" />

            {/* Lead */}
            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted leading-relaxed inline-block">
                {copy.lead.line1}
                <br />
                <strong>{copy.lead.strong}</strong> {copy.lead.line2}
            </p>
        </section>
    );
}
