import * as strings from 'SalesOrdersAdaptiveCardExtensionStrings';

import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  ImageCardView,
  IQuickViewCardAction,
} from '@microsoft/sp-adaptive-card-extension-base';

import {
  CARD_ICON,
  CARD_IMAGE,
} from '../../../constants/constants';
import {
  ISalesOrdersAdaptiveCardExtensionProps,
  ISalesOrdersAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID,
} from '../SalesOrdersAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  ISalesOrdersAdaptiveCardExtensionProps,
  ISalesOrdersAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    return ImageCardView({
      cardBar: {
        componentName: "cardBar",
        title: this.properties.title,
        icon: { url: CARD_ICON }

      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      footer: {
        componentName: 'cardButton',
        title: strings.ButtonText,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      },
      image: { url: CARD_IMAGE },
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
