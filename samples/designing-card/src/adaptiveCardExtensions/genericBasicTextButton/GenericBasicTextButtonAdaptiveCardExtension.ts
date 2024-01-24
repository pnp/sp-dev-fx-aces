import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericBasicTextButtonPropertyPane } from './GenericBasicTextButtonPropertyPane';

export interface IGenericBasicTextButtonAdaptiveCardExtensionProps {
  title: string;
}

export interface IGenericBasicTextButtonAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericBasicTextButton_CARD_VIEW';

export default class GenericBasicTextButtonAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericBasicTextButtonAdaptiveCardExtensionProps,
  IGenericBasicTextButtonAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericBasicTextButtonPropertyPane;

  public onInit(): Promise<void> {
    this.state = { };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericBasicTextButton-property-pane'*/
      './GenericBasicTextButtonPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericBasicTextButtonPropertyPane();
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
