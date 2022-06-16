import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'FollowDocumentAcEsAdaptiveCardExtensionStrings';
import { IFollowDocumentAcEsAdaptiveCardExtensionProps, IFollowDocumentAcEsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../FollowDocumentAcEsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IFollowDocumentAcEsAdaptiveCardExtensionProps, IFollowDocumentAcEsAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: strings.PrimaryText,
      description: this.properties.description + " " + this.context.pageContext.user.displayName,
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: this.properties.URL === undefined || this.properties.URL.length == 0 ? 'https://www.bing.com' : this.properties.URL,
      }
    };
  }
}
