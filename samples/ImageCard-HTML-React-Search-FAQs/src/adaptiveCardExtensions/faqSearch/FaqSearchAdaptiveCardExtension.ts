import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { FaqSearchPropertyPane } from './FaqSearchPropertyPane';
import { Logger, LogLevel, ConsoleListener } from "@pnp/logging";

export interface IFaqSearchAdaptiveCardExtensionProps {
  title: string;
  heading: string;
  quickViewButton: string;
  imageUrl: string;
  siteUrl: string;
  faqListName: string;
  submitionListName: string;
  faqCollectionData: any[];  // Ensure this is an array
  faqFilterLabel: string;
}

export interface IFaqSearchAdaptiveCardExtensionState {}

const CARD_VIEW_REGISTRY_ID: string = 'FaqSearch_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'FaqSearch_QUICK_VIEW';

export default class FaqSearchAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFaqSearchAdaptiveCardExtensionProps,
  IFaqSearchAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: FaqSearchPropertyPane;

  public onInit(): Promise<void> {
    // Initialize faqCollectionData if it's not already set
    if (!this.properties.faqCollectionData) {
      this.properties.faqCollectionData = [];
    }

    Logger.subscribe(new ConsoleListener()); // Logs output to the console
    Logger.activeLogLevel = LogLevel.Info;   // Set the default log level (Info, Verbose, Warning, Error)

    // Register card and quick views
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FaqSearch-property-pane'*/
      './FaqSearchPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FaqSearchPropertyPane(this.properties);
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
