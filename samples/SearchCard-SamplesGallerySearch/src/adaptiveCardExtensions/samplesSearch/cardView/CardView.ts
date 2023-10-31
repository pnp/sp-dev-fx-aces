import {
  BaseComponentsCardView,
  ISearchCardViewParameters,
  SearchCardView,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardSearchFooterConfiguration
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SamplesSearchAdaptiveCardExtensionStrings';
import {
  ISamplesSearchAdaptiveCardExtensionProps,
  ISamplesSearchAdaptiveCardExtensionState,
  SEARCH_RESULTS_QUICK_VIEW_REGISTRY_ID,
  SEARCH_BOX_ID
} from '../SamplesSearchAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  ISamplesSearchAdaptiveCardExtensionProps,
  ISamplesSearchAdaptiveCardExtensionState,
  ISearchCardViewParameters
> {
  public get cardViewParameters(): ISearchCardViewParameters {
    
    // Default value for the footer
    const footer: ICardSearchFooterConfiguration = {
      componentName: 'searchFooter',
      title: strings.Suggested,
      text: 'No suggestions found',
      imageInitials: 'NA'
    };

    // if there is a suggested person, update the footer
    const { suggestedSample } = this.state;
    if (suggestedSample) {
      footer.text = suggestedSample.title;
      footer.imageUrl = suggestedSample.authors.length > 0 ? suggestedSample.authors[0].pictureUrl : undefined;
      footer.onSelection = {
        type: 'ExternalLink',
        parameters: {
          target: suggestedSample.url,
          isTeamsDeepLink: false
        }
      };
    }

    return SearchCardView({
      cardBar: {
        componentName: 'cardBar',
        title: strings.Title
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
        },
        onChange: async (value: string) => {
          this.setState({queryString: value});
          await this.properties.getSuggestedSample();
        }
      },
      footer: footer
    });
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return undefined;
  }
}
