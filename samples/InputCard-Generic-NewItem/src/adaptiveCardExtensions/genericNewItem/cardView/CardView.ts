import {
  BaseComponentsCardView,
  BasicCardView,
  ComponentsCardViewParameters,
  IActionArguments,
  TextInputCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'GenericNewItemAdaptiveCardExtensionStrings';
import {
  ERROR_CARD_VIEW_REGISTRY_ID,
  IGenericNewItemAdaptiveCardExtensionProps,
  IGenericNewItemAdaptiveCardExtensionState,
  SUCCESS_CARD_VIEW_REGISTRY_ID
} from '../GenericNewItemAdaptiveCardExtension';
import NewItemService from '../../../NewItemService';

export class CardView extends BaseComponentsCardView<
  IGenericNewItemAdaptiveCardExtensionProps,
  IGenericNewItemAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    if (this.properties.bodyOrFooter === 'Body') {
      return TextInputCardView({
        cardBar: {
          componentName: 'cardBar',
          title: this.properties.title
        },
        header: {
          componentName: 'text',
          text: this.properties.subTitle
        },
        body: {
          componentName: 'textInput',
          placeholder: strings.Placeholder,
          id: 'item',
          iconBefore: {
            url: 'Edit'
          }
        },
        footer: {
          componentName: 'cardButton',
          title: this.properties.buttonLabel,
          style: 'positive',
          action: {
            type: 'Submit',
            parameters: {
              id: 'sendItem'
            }
          }
        }
      });

    } else {
      return BasicCardView({
        cardBar: {
          componentName: 'cardBar',
          title: this.properties.title
        },
        header: {
          componentName: 'text',
          text: this.properties.subTitle
        },
        footer: {
          componentName: 'textInput',
          id: 'item',
          placeholder: strings.Placeholder,
          button: {
            icon: {
              url: this.properties.iconName
            },
            action: {
              type: 'Submit',
              parameters: {
                id: 'sendItem'
              }
            }
          }
        }
      });
    }
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      if (action.type === 'Submit' && action.data?.id === 'sendItem') {
        const item: string = action.data.item;
        const listId = await NewItemService._getListId(this.properties.listTitle);
        await NewItemService._createItem(listId, item);
        this.cardNavigator.replace(SUCCESS_CARD_VIEW_REGISTRY_ID);
      }
    } catch (error) {
      console.error(error);
      this.cardNavigator.replace(ERROR_CARD_VIEW_REGISTRY_ID);
    }
  }
}
