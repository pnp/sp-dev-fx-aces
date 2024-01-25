import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericBasicTextNoButtonPropertyPane } from './GenericBasicTextNoButtonPropertyPane';

export interface IGenericBasicTextNoButtonAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericBasicTextNoButtonAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericBasicTextNoButton_CARD_VIEW';

export default class GenericBasicTextNoButtonAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericBasicTextNoButtonAdaptiveCardExtensionProps,
  IGenericBasicTextNoButtonAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericBasicTextNoButtonPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericBasicTextNoButton-property-pane'*/
      './GenericBasicTextNoButtonPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericBasicTextNoButtonPropertyPane();
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
