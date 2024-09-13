import {
  IImageCardParameters,
  BaseImageCardView,
  ICardButton,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'FrequentlyAskedQuestionsAdaptiveCardExtensionStrings';
import {
  IFrequentlyAskedQuestionsAdaptiveCardExtensionProps,
  IFrequentlyAskedQuestionsAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../FrequentlyAskedQuestionsAdaptiveCardExtension';

export class CardView extends BaseImageCardView<
  IFrequentlyAskedQuestionsAdaptiveCardExtensionProps,
  IFrequentlyAskedQuestionsAdaptiveCardExtensionState
> {

  public get data(): IImageCardParameters {

    const { theme } = this.state;
    // get the colours for the placeholder image
    const palette = theme?.palette;
    const placeholderBackgroundColor = palette?.themePrimary?.replace('#', '') || '0078d4';
    const placeholderTextColor = palette?.themeLighterAlt?.replace('#', '') || 'f3f2f1';


    return {
      title: this.properties.title,
      primaryText: '',
      imageUrl: this.properties.mainImage || `https://placehold.co/164x180/${placeholderBackgroundColor}/${placeholderTextColor}.webp?text=FAQs`,
      imageAltText: this.properties.title
    };
  }

  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: 'See FAQs',
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
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
