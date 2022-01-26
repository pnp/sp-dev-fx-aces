import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'MyEmailsAdaptiveCardExtensionStrings';
import { IMyEmailsAdaptiveCardExtensionProps, IMyEmailsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../MyEmailsAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IMyEmailsAdaptiveCardExtensionProps, IMyEmailsAdaptiveCardExtensionState> {
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

    if (this.state.currentIndex < this.state.emails.length - 1) {
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

  public get data(): IPrimaryTextCardParameters {
    if (this.state.emails.length > 0) {
      return {
        primaryText: "Sub: " + this.state.emails[this.state.currentIndex].subject,
        description: "From: " + this.state.emails[this.state.currentIndex].from.emailAddress.address
      };
    }
    else {
      return {
        primaryText: "Loading",
        description: "Loading"
      };
    }
  }
  public onAction(action: IActionArguments): void {
    if (action.type === 'Submit') {
      const { id, op } = action.data;
      switch (id) {
        case 'previous': {
          this.setState({ currentIndex: this.state.currentIndex - 1, currentEmail: this.state.emails[this.state.currentIndex - 1] });
          break;
        }
        case 'next': {
          this.setState({ currentIndex: this.state.currentIndex + 1, currentEmail: this.state.emails[this.state.currentIndex + 1] });
          break;
        }
        case 'default': { }

      }
    }
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
