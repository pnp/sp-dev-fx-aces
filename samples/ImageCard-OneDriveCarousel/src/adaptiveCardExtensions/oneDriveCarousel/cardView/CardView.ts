import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'OneDriveCarouselAdaptiveCardExtensionStrings';
import { IOneDriveCarouselAdaptiveCardExtensionProps, IOneDriveCarouselAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../OneDriveCarouselAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IOneDriveCarouselAdaptiveCardExtensionProps, IOneDriveCarouselAdaptiveCardExtensionState> {
  /**
   * Buttons will not be visible if card size is 'Medium' with Image Card View.
   * It will support up to two buttons for 'Large' card size.
   */
  public get cardButtons():[ICardButton] | [ICardButton, ICardButton] | undefined {
    var buttons = [];
    
    if(!this.state.error && !this.state.isLoading && this.state.folderHasImages && 
      (this.properties.hideButtons == undefined || this.properties.hideButtons == false) &&
       this.state.targetFolder != undefined) {
      buttons = [
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

    return <[ICardButton] | [ICardButton, ICardButton] | undefined>buttons;
  }

  public get data(): IImageCardParameters {    
    return {
      primaryText: this.getPrimaryText(),
      imageUrl: this.getImageUrl()
    };
  }

  private getPrimaryText(): string {
    if (this.state.error) {
      return strings.ErrorMessage;
    }
    
    let primaryText: string = strings.PrimaryText;
    
    if(this.properties.description) {
      primaryText = this.properties.description;
    }
    else if (this.state.targetFolder) {
      primaryText = this.state.targetFolder.name;
    }

    return primaryText;
  }

  private getImageUrl(): string {
    if (this.state.error) {
      return require('../assets/Error.png');
    }
    
    // If not loading
    if(this.state.isLoading == false) {
      // If there is an image set the image webUrl
      if (this.state.targetFolder && this.state.targetFolder.children && this.state.targetFolder.children.length > 0) {
        return this.state.targetFolder.children[this.state.itemIndex].webUrl;
      }
      
      // If there are no images in the target folder set a default image
      if(this.state.folderHasImages == false) {
        return require("../assets/MicrosoftLogo.png");
      }
    }

    return require("../assets/loading.svg");
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: (this.state.targetFolder) ? this.state.targetFolder.webUrl : "https://onedrive.com/"
      }
    };
  }
}
