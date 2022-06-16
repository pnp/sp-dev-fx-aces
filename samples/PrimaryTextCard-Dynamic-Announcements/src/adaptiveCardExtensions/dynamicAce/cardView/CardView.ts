import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'DynamicAceAdaptiveCardExtensionStrings';
import { IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../DynamicAceAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IDynamicAceAdaptiveCardExtensionProps, IDynamicAceAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const buttons: ICardButton[] = [];
    if (this.state.currentIndex > 0) {
      buttons.push({
        title: 'Previous',
        action: {
          type: 'Submit',
          parameters: {
            id: 'previous'
          }
        }
      });
    }

    if (this.state.currentIndex < this.state.items.length - 1) {
      buttons.push({
        title: 'Next',
        action: {
          type: 'Submit',
          parameters: {
            id: 'next'
          }
        }
      });
    }
    return buttons as [ICardButton] | [ICardButton, ICardButton];
  }

  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      const { id, op } = action.data;
      switch (id) {
        case 'previous': {
          this.setState({ currentIndex: this.state.currentIndex - 1, currentitem: this.state.items[this.state.currentIndex - 1] });
          break;
        }
        case 'next': {
          this.setState({ currentIndex: this.state.currentIndex + 1, currentitem: this.state.items[this.state.currentIndex + 1] });
          break;
        }
        case 'default': { }

      }
    }
  }
  

  public get data(): IPrimaryTextCardParameters {
    if (this.state.items.length > 0) {
      return {
        primaryText: this.state.items[this.state.currentIndex].CardViewTitle,
        description: this.state.items[this.state.currentIndex].CardViewDescription
      };
    }
    else {
      return {
        primaryText: "No card for today",
        description: "Have a beautiful day"
      };
    }
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {

    if(this.state.currentitem && this.state.currentitem.OnCardSelectionType == "QuickView") {
     //this.setState({clickedview:true})
      return {
        type: 'QuickView',
        parameters: {
          view: QUICK_VIEW_REGISTRY_ID

        }
      };
    }
    else if(this.state.currentitem &&this.state.currentitem.OnCardSelectionType == "ExternalLink") {
         return {
            type: 'ExternalLink',
            parameters: {
              target: this.state.currentitem.ExternalLinkURL
            }
          };
        }
    else if(this.state.currentitem && this.state.currentitem.OnCardSelectionType == "Noaction") {
    
      }
    }

  // public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
  //   return {
  //     type: 'ExternalLink',
  //     parameters: {
  //       target: 'https://www.bing.com'
  //     }
  //   };
  // }
}
