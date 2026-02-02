import Hero from "@/components/landing/Hero";
import { getLocale } from "@/lib/locale/getLocale";
import { getCopy } from "@/lib/locale/getCopy";
import Concepts from "@/components/landing/Concepts";
import Manifesto from "@/components/landing/Manifesto";
import Preview from "@/components/landing/Preview";
import Footer from "@/components/landing/Footer";

export default async function HomePage() {
    const locale = await getLocale();
    const copy = getCopy(locale);

    return (
        <main className="min-h-screen text-white relative z-10">
            <Hero copy={copy.hero} />
            <Concepts />
            <Manifesto />
            <Preview />
            <Footer />
        </main>
    );
}
