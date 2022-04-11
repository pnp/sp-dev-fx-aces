import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'RecentFilesAceAdaptiveCardExtensionStrings';
import { IRecentFilesAceAdaptiveCardExtensionProps, IRecentFilesAceAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../RecentFilesAceAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<IRecentFilesAceAdaptiveCardExtensionProps, IRecentFilesAceAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    let buttons = [];

    if (this.getRecentFilesCount() > 0) {
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
    const recentCount: number = this.getRecentFilesCount();
    return {
      primaryText: `${recentCount} ${strings.RecentFiles}`,
      description: (recentCount > 0) ? strings.RecentsDescription : strings.NoRecentsDescription,
      title: this.properties.title
    };
  }

  private getRecentFilesCount = (): number => {
    let recentCount: number = 0;

    if (this.state.recents && this.state.recents.length > 0) {
      recentCount = this.state.recents.length;
    }

    return recentCount;
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: this.state.oneDriveUrl
      }
    };
  }
}
