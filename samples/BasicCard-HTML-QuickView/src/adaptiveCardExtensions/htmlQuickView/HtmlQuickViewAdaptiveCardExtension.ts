import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { HtmlQuickViewPropertyPane } from './HtmlQuickViewPropertyPane';

export interface IHtmlQuickViewAdaptiveCardExtensionProps {
  title: string;
}

export interface IHtmlQuickViewAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'HtmlQuickView_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'HtmlQuickView_QUICK_VIEW';

export default class HtmlQuickViewAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHtmlQuickViewAdaptiveCardExtensionProps,
  IHtmlQuickViewAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HtmlQuickViewPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'HtmlQuickView-property-pane'*/
      './HtmlQuickViewPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.HtmlQuickViewPropertyPane();
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
