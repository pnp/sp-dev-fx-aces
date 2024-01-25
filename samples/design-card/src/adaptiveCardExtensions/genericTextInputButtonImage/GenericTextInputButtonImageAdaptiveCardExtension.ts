import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericTextInputButtonImagePropertyPane } from './GenericTextInputButtonImagePropertyPane';

export interface IGenericTextInputButtonImageAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericTextInputButtonImageAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericTextInputButtonImage_CARD_VIEW';

export default class GenericTextInputButtonImageAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericTextInputButtonImageAdaptiveCardExtensionProps,
  IGenericTextInputButtonImageAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericTextInputButtonImagePropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericTextInputButtonImage-property-pane'*/
      './GenericTextInputButtonImagePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericTextInputButtonImagePropertyPane();
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
