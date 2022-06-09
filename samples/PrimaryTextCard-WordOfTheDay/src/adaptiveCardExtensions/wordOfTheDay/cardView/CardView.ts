import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  CardSize
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'WordOfTheDayAdaptiveCardExtensionStrings';
import { IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../WordOfTheDayAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IWordOfTheDayAdaptiveCardExtensionProps, IWordOfTheDayAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    let buttons = [];

    if(this.state.wordOfTheDay) {
      buttons.push({
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      });
    }

    return <[ICardButton] | [ICardButton, ICardButton] | undefined>buttons;
  }

  public get data(): IPrimaryTextCardParameters {
    let primaryText = strings.Loading;
    let description = strings.Loading;

    if(this.state.wordOfTheDay) {
      primaryText = this.state.wordOfTheDay.word;
      // Uppercase first letter
      primaryText = primaryText[0].toUpperCase() + primaryText.slice(1);
      
      if(this.state.wordOfTheDay.note 
        && this.state.wordOfTheDay.note.length 
        && this.cardSize == 'Large') {
          description = `${this.state.wordOfTheDay.note}`;
      }
      else {
        description = `${strings.Definitions} ${this.state.wordOfTheDay.definitions.length}\n\r${strings.Examples} ${this.state.wordOfTheDay.examples.length}`;
      }
    }
    else if(this.state.isError) {
      primaryText = strings.ErrorTitle;
      description = (this.properties.apiKey && this.properties.apiKey.length > 0) ? strings.ErrorGenericDescription : strings.ErrorMissingAPIKeyDescription;
    }
    
    return {
      primaryText: primaryText,
      description: description
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.wordnik.com/word-of-the-day'
      }
    };
  }
}
