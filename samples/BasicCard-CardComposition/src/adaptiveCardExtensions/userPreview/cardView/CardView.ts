import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'UserPreviewAdaptiveCardExtensionStrings';
import { IUserPreviewAdaptiveCardExtensionProps, IUserPreviewAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID,QUICK_VIEW_Colleagues_REGISTRY_ID } from '../UserPreviewAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IUserPreviewAdaptiveCardExtensionProps, IUserPreviewAdaptiveCardExtensionState> {
  constructor(public user: {displayName: string, jobTitle: string}) {
    super();

  }
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.SearchPeople,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      },
      
      {
        title: strings.ShowColleagues,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_Colleagues_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IBasicCardParameters {
    return {
      primaryText: this.user.displayName,
      title: strings.PrimaryText,
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}
