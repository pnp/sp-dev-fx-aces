import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
export interface IStockBitcoinFeedAdaptiveCardExtensionProps {
    title: string;
    finnhubtoken: string;
    finnhubsymbol: string;
    description: string;
}
export interface IStockBitcoinFeedAdaptiveCardExtensionState {
    lastPrice: number;
}
export default class StockBitcoinFeedAdaptiveCardExtension extends BaseAdaptiveCardExtension<IStockBitcoinFeedAdaptiveCardExtensionProps, IStockBitcoinFeedAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    protected loadPropertyPaneResources(): Promise<void>;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=StockBitcoinFeedAdaptiveCardExtension.d.ts.map