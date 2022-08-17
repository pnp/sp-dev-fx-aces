export declare enum CardSelectionType {
    Noaction = "Noaction",
    ExternalLink = "ExternalLink",
    QuickView = "QuickView"
}
export default interface ISPListitem {
    Id?: number;
    Title?: string;
    CardViewTitle?: string;
    CardViewDescription?: string;
    OnCardSelectionType?: string;
    ExternalLinkURL?: string;
    QuickViewAdaptiveCardJSON?: string;
    QuickViewAdaptiveCardData?: string;
}
//# sourceMappingURL=IListItem.d.ts.map