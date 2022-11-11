import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { WordOfTheDay } from './model/WordOfTheDay';
export interface IWordOfTheDayAdaptiveCardExtensionProps {
    title: string;
    iconProperty: string;
    apiKey: string;
    useSampleData: boolean;
}
export interface IWordOfTheDayAdaptiveCardExtensionState {
    wordOfTheDay: WordOfTheDay;
    isError: boolean;
}
export declare const QUICK_VIEW_REGISTRY_ID: string;
export default class WordOfTheDayAdaptiveCardExtension extends BaseAdaptiveCardExtension<IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState> {
    private _deferredPropertyPane;
    onInit(): Promise<void>;
    private loadWordOfTheDay;
    get title(): string;
    protected get iconProperty(): string;
    protected loadPropertyPaneResources(): Promise<void>;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void;
    protected renderCard(): string | undefined;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=WordOfTheDayAdaptiveCardExtension.d.ts.map