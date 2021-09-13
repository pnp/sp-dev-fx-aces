import { IImageCardParameters } from "@microsoft/sp-adaptive-card-extension-base";

export type GlanceCard = IImageCardParameters & {
    content?: string;
};

export type Article = {
    title?: string;
    link?: string;
    imageUrl?: string;
    content?: string;
};