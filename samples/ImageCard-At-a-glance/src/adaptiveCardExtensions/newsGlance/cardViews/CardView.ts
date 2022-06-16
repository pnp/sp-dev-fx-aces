import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton,
  IActionArguments
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'NewsGlanceAdaptiveCardExtensionStrings';
import { INewsGlanceAdaptiveCardExtensionProps, INewsGlanceAdaptiveCardExtensionState } from '../NewsGlanceAdaptiveCardExtension';

export class CardView extends BaseImageCardView<INewsGlanceAdaptiveCardExtensionProps, INewsGlanceAdaptiveCardExtensionState> {
  public get data(): IImageCardParameters {

    if (this.state.glanceCardIndex < 0) {
      // a loading view
      return {
        primaryText: strings.PrimaryText,
        imageUrl: 'https://c.tenor.com/I6kN-6X7nhAAAAAi/loading-buffering.gif',
        title: "Loading...",
        iconProperty: "Refresh"
      };
    }

    return this.state.glanceCards[this.state.glanceCardIndex];
  }

  get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {

    if (this.state.glanceCardIndex > -1) {

      const buttons = [];

      if (this.state.glanceCardIndex > 0) {

        buttons.push({
          id: "prev",
          title: "⏪",
          action: {
            type: "Submit"
          }
        });
      }

      if (this.state.glanceCardIndex < this.state.numberOfGlanceCards) {

        buttons.push({
          id: "next",
          title: "⏩",
          action: {
            type: "Submit"
          }
        });
      }

      return <any>buttons;
    }
  }

  public onAction(action: IActionArguments): void {

    
    if (action?.id === "next") {

      this.setState({
        glanceCardIndex: this.state.glanceCardIndex + 1,
      });

    } else if (action?.id === "prev") {

      this.setState({
        glanceCardIndex: this.state.glanceCardIndex - 1,
      });

    }
  }

  /* public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: this.state.articleLink
      }
    };
  } */
}
