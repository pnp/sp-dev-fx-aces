import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  BasicCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
  NEW_ITEM_QUICK_VIEW_REGISTRY_ID
} from '../SharePointRestAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  ISharePointRestAdaptiveCardExtensionProps,
  ISharePointRestAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return BasicCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: (this.state.listTitle)
          ? `View items in the '${this.state.listTitle}' list`
          : `Missing list ID`
      },
      footer: (!this.properties.listId)
        ? undefined
        : {
            componentName: 'cardButton',
            title: 'Add item',
            action: {
              type: 'QuickView',
              parameters: { view: NEW_ITEM_QUICK_VIEW_REGISTRY_ID }
            }
          }
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
