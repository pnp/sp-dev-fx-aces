import {
  IImageCardParameters,
  BaseImageCardView,      
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
//import * as strings from 'OfficelocatorAdaptiveCardExtensionStrings';
import {
  IOfficelocatorAdaptiveCardExtensionProps,
  IOfficelocatorAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../OfficelocatorAdaptiveCardExtension';
import mainImage from '../assets/main-image.svg';


export class CardView extends BaseImageCardView<
  IOfficelocatorAdaptiveCardExtensionProps,
  IOfficelocatorAdaptiveCardExtensionState  
> {

  public get data(): IImageCardParameters {

    const { theme } = this.state;
    // get the colours for the placeholder image
    const palette = theme?.palette;
    const placeholderBackgroundColor = palette?.themePrimary?.replace('#', '') || '0078d4';
    const placeholderTextColor = palette?.themeLighterAlt?.replace('#', '') || 'f3f2f1';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    
    return {
      title: this.properties.title,
      primaryText: '',            
      imageUrl: this.properties.mainImage || mainImage || `https://via.placeholder.com/400x200/${placeholderBackgroundColor}/${placeholderTextColor}?text=Locator`,
      imageAltText: this.properties.title
    };
  }

  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: 'Office Locations',
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  // public get cardViewParameters(): ComponentsCardViewParameters {

  //   //const { theme } = this.state;

  //   return BasicCardView({
  //     cardBar: {
  //       componentName: 'cardBar',
  //       title: this.properties.title,
  //       icon: {
  //         url: require('../assets/MicrosoftLogo.png'),
  //       }
  //     },
  //     header: {
  //       componentName: 'text',
  //       text: strings.PrimaryText
  //     },
  //     footer: {
  //       componentName: 'cardButton',
  //       title: strings.QuickViewButton,
  //       action: {
  //         type: 'QuickView',
  //         parameters: {
  //           view: QUICK_VIEW_REGISTRY_ID
  //         }
  //       }
  //     }
  //   });
  // }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.microsoft.com',
      }
    };
  }
}
