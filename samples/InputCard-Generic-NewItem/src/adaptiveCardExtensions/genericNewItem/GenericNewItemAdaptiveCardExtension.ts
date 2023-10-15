/* eslint-disable */
import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { GenericNewItemPropertyPane } from './GenericNewItemPropertyPane';
import { SuccessCardView } from './cardView/SuccessView';
import { ErrorCardView } from './cardView/ErrorView';
import NewItemService from '../../NewItemService';

export interface IGenericNewItemAdaptiveCardExtensionProps {
  title: string;
  listTitle: string;
  bodyOrFooter: string;
  buttonLabel: string;
  subTitle: string;
  iconName: string;
  successTxt: string;
  errorTxt: string;
}

export interface IGenericNewItemAdaptiveCardExtensionState {
}

const CARD_VIEW_REGISTRY_ID: string = 'GenericNewItem_CARD_VIEW';
export const SUCCESS_CARD_VIEW_REGISTRY_ID: string = 'GenericNewItem_SUCCESS_CARD_VIEW';
export const ERROR_CARD_VIEW_REGISTRY_ID: string = 'GenericNewItem_ERROR_CARD_VIEW';

export default class GenericNewItemAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IGenericNewItemAdaptiveCardExtensionProps,
  IGenericNewItemAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: GenericNewItemPropertyPane;

  public async onInit(): Promise<void> {
    this.state = { };
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.cardNavigator.register(SUCCESS_CARD_VIEW_REGISTRY_ID, () => new SuccessCardView());
    this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());

    await NewItemService._getClient(this.context);
    NewItemService.setup(this.context);

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'GenericNewItem-property-pane'*/
      './GenericNewItemPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.GenericNewItemPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void> {
    if (newValue !== oldValue) {
      // if (propertyPath === "listTitle") {
        
      // }
      this.renderCard();
    }
  }
}
