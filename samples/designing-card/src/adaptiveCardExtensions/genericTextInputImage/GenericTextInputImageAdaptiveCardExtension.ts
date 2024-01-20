import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericTextInputImagePropertyPane } from './GenericTextInputImagePropertyPane';

export interface IGenericTextInputImageAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericTextInputImageAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericTextInputImage_CARD_VIEW';

export default class GenericTextInputImageAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericTextInputImageAdaptiveCardExtensionProps,
  IGenericTextInputImageAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericTextInputImagePropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericTextInputImage-property-pane'*/
      './GenericTextInputImagePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericTextInputImagePropertyPane();
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
