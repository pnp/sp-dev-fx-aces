import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericPrimaryTextNoButtonPropertyPane } from './GenericPrimaryTextNoButtonPropertyPane';

export interface IGenericPrimaryTextNoButtonAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericPrimaryTextNoButtonAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericPrimaryTextNoButton_CARD_VIEW';

export default class GenericPrimaryTextNoButtonAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericPrimaryTextNoButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextNoButtonAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericPrimaryTextNoButtonPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericPrimaryTextNoButton-property-pane'*/
      './GenericPrimaryTextNoButtonPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericPrimaryTextNoButtonPropertyPane();
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
