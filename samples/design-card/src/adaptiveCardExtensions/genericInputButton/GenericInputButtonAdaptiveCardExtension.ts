import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericInputButtonPropertyPane } from './GenericInputButtonPropertyPane';

export interface IGenericInputButtonAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericInputButtonAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericInputButton_CARD_VIEW';

export default class GenericInputButtonAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericInputButtonAdaptiveCardExtensionProps,
  IGenericInputButtonAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericInputButtonPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericInputButton-property-pane'*/
      './GenericInputButtonPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericInputButtonPropertyPane();
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
