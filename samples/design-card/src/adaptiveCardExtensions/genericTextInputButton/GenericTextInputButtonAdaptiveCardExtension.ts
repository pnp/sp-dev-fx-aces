import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericTextInputButtonPropertyPane } from './GenericTextInputButtonPropertyPane';

export interface IGenericTextInputButtonAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericTextInputButtonAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericTextInputButton_CARD_VIEW';

export default class GenericTextInputButtonAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericTextInputButtonAdaptiveCardExtensionProps,
  IGenericTextInputButtonAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericTextInputButtonPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericTextInputButton-property-pane'*/
      './GenericTextInputButtonPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericTextInputButtonPropertyPane();
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
