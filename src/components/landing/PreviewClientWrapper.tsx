"use client";

import dynamic from "next/dynamic";

const PreviewTiles = dynamic(() => import("./PreviewTiles"), { ssr: false });

type PreviewClientWrapperProps = {
    items: {
        informed: { label: string; hint: string };
        empowered: { label: string; hint: string };
        warned: { label: string; hint: string };
        threatened: { label: string; hint: string };
        themed: { label: string; hint: string };
        glowed: { label: string; hint: string };
    };
};

export default function PreviewClientWrapper({ items }: PreviewClientWrapperProps) {
    return <PreviewTiles items={items} />;
}
