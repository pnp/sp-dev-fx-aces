import {
  BaseComponentsCardView,
  ISearchCardViewParameters,
  SearchCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardSearchFooterConfiguration
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleSearchAdaptiveCardExtensionStrings';
import {
  IPeopleSearchAdaptiveCardExtensionProps,
  IPeopleSearchAdaptiveCardExtensionState,
  SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID,
  ITEM_QUICK_VIEW_REGISTRY_ID,
  SEARCH_BOX_ID
} from '../PeopleSearchAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<IPeopleSearchAdaptiveCardExtensionProps, IPeopleSearchAdaptiveCardExtensionState, ISearchCardViewParameters> {
  public get cardViewParameters(): ISearchCardViewParameters {
    // default value for the footer
    const footer: ICardSearchFooterConfiguration = {
      componentName: 'searchFooter',
      title: strings.Suggested,
      text: 'No suggestions found',
      imageInitials: 'NA'
    };

    // if there is a suggested person, update the footer
    const { suggested } = this.state;
    if (suggested) {
      footer.text = suggested.displayName;
      footer.secondaryText = suggested.jobTitle || suggested.emailAddress;
      footer.imageUrl = suggested.picture;
      footer.onSelection = {
        type: 'QuickView',
        parameters: {
          view: ITEM_QUICK_VIEW_REGISTRY_ID
        }
      };
    }

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
      footer: footer
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return undefined;
  }
}
