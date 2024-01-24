import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericPrimaryTextInputButtonPropertyPane } from './GenericPrimaryTextInputButtonPropertyPane';

export interface IGenericPrimaryTextInputButtonAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericPrimaryTextInputButtonAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericPrimaryTextInputButton_CARD_VIEW';

export default class GenericPrimaryTextInputButtonAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericPrimaryTextInputButtonAdaptiveCardExtensionProps,
  IGenericPrimaryTextInputButtonAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericPrimaryTextInputButtonPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericPrimaryTextInputButton-property-pane'*/
      './GenericPrimaryTextInputButtonPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericPrimaryTextInputButtonPropertyPane();
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
