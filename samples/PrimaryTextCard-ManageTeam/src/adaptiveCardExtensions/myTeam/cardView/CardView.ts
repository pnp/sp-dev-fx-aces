import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import { IMyTeamAdaptiveCardExtensionProps, IMyTeamAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../MyTeamAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IMyTeamAdaptiveCardExtensionProps, IMyTeamAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    const buttons: ICardButton[] = [];
    if (this.state.currentIndex > 0) {
      buttons.push({
        title: 'Previous',
        action: {
          type: 'Submit',
          parameters: {
            id: 'previous',
            op: -1
          }
        }
      });
    }

    if (this.state.currentIndex < (this.state.currentConfig?.members?.length ?? 0) - 1) {
      buttons.push({
        title: 'Next',
        action: {
          type: 'Submit',
          parameters: {
            id: 'next',
            op: 1 // Increment the index
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
        case 'previous':
        case 'next':
          this.setState({ currentIndex: this.state.currentIndex + op });
          break;
      }
    }
  }

  public get data(): IBasicCardParameters {
    const members = this.state.currentConfig?.members ?? [];
    const current = members[this.state.currentIndex];
    if (!current) {
      return { primaryText: 'No team members found.' };
    }
    return {
      primaryText: `Display Name: ${current.displayName} | mail: ${current.mail}`,
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID,
      }
    };
  }
}
