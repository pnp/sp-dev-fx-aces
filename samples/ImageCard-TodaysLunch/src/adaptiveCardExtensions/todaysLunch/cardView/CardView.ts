import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TodaysLunchAdaptiveCardExtensionStrings';
import { ITodaysLunchAdaptiveCardExtensionProps, ITodaysLunchAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../TodaysLunchAdaptiveCardExtension';

export class CardView extends BaseImageCardView<ITodaysLunchAdaptiveCardExtensionProps, ITodaysLunchAdaptiveCardExtensionState> {
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
    // const lunch: ILunchs = this.state.todaysLunch;
    // const icon: string = lunch.hasVeganDishes ? 
    //   'https://cdn2.iconfinder.com/data/icons/restaurant-1/100/vegan_food_meal_dinner_lunch_restaurant_vegetables-512.png' : 
    //   'https://cdn4.iconfinder.com/data/icons/food-and-equipment-solid/32/meat-512.png';
    const icon: string = require('./../assets/menu_icon.svg');
    const image: string = require('./../assets/menu.jpg');
    
    return {
      title: strings.CardViewTitle,
      primaryText: strings.CardViewPrimaryText,
      imageUrl: image, 
      iconProperty: icon
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
