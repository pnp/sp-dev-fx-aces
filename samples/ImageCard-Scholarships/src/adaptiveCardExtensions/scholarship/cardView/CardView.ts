import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ScholarshipAdaptiveCardExtensionStrings';
import { IScholarshipAdaptiveCardExtensionProps, IScholarshipAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../ScholarshipAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IScholarshipAdaptiveCardExtensionProps, IScholarshipAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
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

  public get data(): IImageCardParameters {
    const tabsData: any = require('../../scholarship/models/scholarship-sample-data.json');
    return {
      primaryText: `${tabsData.newTabScholarshipData.length} new\n ${tabsData.appliedTabScholarshipData.length} applied`,
      imageUrl: require('../assets/cardimage.png'),
      title: this.properties.title
    };
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
