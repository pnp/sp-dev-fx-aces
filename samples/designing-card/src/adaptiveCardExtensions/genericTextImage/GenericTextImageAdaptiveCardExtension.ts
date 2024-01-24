import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericTextImagePropertyPane } from './GenericTextImagePropertyPane';

export interface IGenericTextImageAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericTextImageAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericTextImage_CARD_VIEW';

export default class GenericTextImageAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericTextImageAdaptiveCardExtensionProps,
  IGenericTextImageAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericTextImagePropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericTextImage-property-pane'*/
      './GenericTextImagePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericTextImagePropertyPane();
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
