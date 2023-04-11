import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';


import { InternPropertyPane } from './InternPropertyPane';

export interface IInternAdaptiveCardExtensionProps {
  title: string;
}
export interface IInternAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'InternshipDemo_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'InternshipDemo_QUICK_VIEW';

export default class InternAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IInternAdaptiveCardExtensionProps,
  IInternAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: InternPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {newdata: []};

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'InternshipDemo-property-pane'*/
      './InternPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.InternPropertyPane();
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
