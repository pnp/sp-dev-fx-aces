import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { TuitionPropertyPane } from './TuitionPropertyPane';

export interface ITuitionAdaptiveCardExtensionProps {
  title: string;
}

export interface ITuitionAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'Tuition_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Tuition_QUICK_VIEW';

export default class TuitionAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ITuitionAdaptiveCardExtensionProps,
  ITuitionAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: TuitionPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = { };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Tuition-property-pane'*/
      './TuitionPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.TuitionPropertyPane();
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
