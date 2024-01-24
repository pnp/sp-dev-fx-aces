import {
  BaseComponentsCardView,
  ISearchCardViewParameters,
  SearchCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SearchBoxAdaptiveCardExtensionStrings';
import {
  ISearchBoxAdaptiveCardExtensionProps,
  ISearchBoxAdaptiveCardExtensionState,
  SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID,
  ITEM_QUICK_VIEW_REGISTRY_ID,
  SEARCH_BOX_ID
} from '../SearchBoxAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  ISearchBoxAdaptiveCardExtensionProps,
  ISearchBoxAdaptiveCardExtensionState,
  ISearchCardViewParameters
> {
  public get cardViewParameters(): ISearchCardViewParameters {
    return SearchCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: strings.PrimaryText
      },
      body: {
        componentName: 'searchBox',
        placeholder: strings.Placeholder,
        id: SEARCH_BOX_ID,
        button: {
          action: {
            type: 'QuickView',
            parameters: {
              view: SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID
            }
          }
        }
      },
      footer: {
        componentName: 'searchFooter',
        title: strings.Suggested,
        imageInitials: 'MB',
        text: strings.Title,
        onSelection: {
          type: 'QuickView',
          parameters: {
            view: ITEM_QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return undefined;
  }
}
