import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { ReactQuickViewPropertyPane } from './ReactQuickViewPropertyPane';

export interface IReactQuickViewAdaptiveCardExtensionProps {
  title: string;
  listName: string;
}

export interface IReactQuickViewAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'ReactQuickView_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'ReactQuickView_QUICK_VIEW';

export default class ReactQuickViewAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IReactQuickViewAdaptiveCardExtensionProps,
  IReactQuickViewAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: ReactQuickViewPropertyPane;

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
      /* webpackChunkName: 'ReactQuickView-property-pane'*/
      './ReactQuickViewPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.ReactQuickViewPropertyPane();
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
