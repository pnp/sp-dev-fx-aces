import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'NewsFeedCardAdaptiveCardExtensionStrings';
import { INewsFeedCardAdaptiveCardExtensionProps, INewsFeedCardAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../NewsFeedCardAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<INewsFeedCardAdaptiveCardExtensionProps, INewsFeedCardAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    if (this.state && this.state.news !== null && this.state.news.length > 0)
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
    return;
  }

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: strings.PrimaryText,
      description: (this.state && this.state.news !== null) ? this.state.news?.length === 0 ? strings.NoNews : strings.News.replace('{0}', this.state.totalNews.toString()) : strings.Loading,
      title: this.properties.title
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: `${this.context.pageContext.web.absoluteUrl}/_layouts/15/news.aspx`
      }
    };
  }
}
