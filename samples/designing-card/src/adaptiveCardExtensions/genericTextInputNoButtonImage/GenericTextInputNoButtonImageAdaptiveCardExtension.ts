import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericTextInputNoButtonImagePropertyPane } from './GenericTextInputNoButtonImagePropertyPane';

export interface IGenericTextInputNoButtonImageAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericTextInputNoButtonImageAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericTextInputNoButtonImage_CARD_VIEW';

export default class GenericTextInputNoButtonImageAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericTextInputNoButtonImageAdaptiveCardExtensionProps,
  IGenericTextInputNoButtonImageAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericTextInputNoButtonImagePropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericTextInputNoButtonImage-property-pane'*/
      './GenericTextInputNoButtonImagePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericTextInputNoButtonImagePropertyPane();
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
