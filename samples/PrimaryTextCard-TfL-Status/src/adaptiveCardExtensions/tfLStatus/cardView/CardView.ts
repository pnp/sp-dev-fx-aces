import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TfLStatusAdaptiveCardExtensionStrings';
import { ITfLStatusAdaptiveCardExtensionProps, ITfLStatusAdaptiveCardExtensionState, LINES_VIEW_REGISTRY_ID } from '../TfLStatusAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<ITfLStatusAdaptiveCardExtensionProps, ITfLStatusAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: "View all lines",
        style: 'positive',
        action: {
          type: 'QuickView',
          parameters: {
            view: LINES_VIEW_REGISTRY_ID
          }
        }
      },
      {
        title: 'Open TfL site',
        style: 'positive',
        action: {
          type: 'ExternalLink',
          parameters: {
            target: 'https://tfl.gov.uk/tube-dlr-overground/status'
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {

    if(this.state.line === null) {
      return {
        primaryText: "Loading...",
        description: ""
      };
    }

    return {
      primaryText: this.state.line.name,
      description: this.state.line.status,
      iconProperty: `data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='20 10 162 162'%3E%3Cpath d='M138.441 96.373c0 23.242-18.857 42.088-42.097 42.088-23.248 0-42.085-18.846-42.085-42.088 0-23.238 18.838-42.08 42.085-42.08 23.24 0 42.097 18.842 42.097 42.08zM96.344 31.15c-36.029 0-65.234 29.203-65.234 65.223 0 36.026 29.205 65.233 65.234 65.233 36.021 0 65.224-29.207 65.224-65.233 0-36.02-29.203-65.223-65.224-65.223z' fill='${this.state.line.colour}'%3E%3C/path%3E %3E%3Cpath d='M16.257 83.205h160.241v26.387H16.257V83.205z' fill='${this.state.line.colour}'%3E%3C/path%3E %3C/svg%3E`,
      title: "TfL Status"
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://tfl.gov.uk/tube-dlr-overground/status'
      }
    };
  }
}
