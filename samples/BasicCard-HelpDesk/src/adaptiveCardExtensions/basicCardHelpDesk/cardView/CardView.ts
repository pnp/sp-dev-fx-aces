import {
  BaseComponentsCardView,
  ComponentsCardViewParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  PrimaryTextCardView
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'BasicCardHelpDeskAdaptiveCardExtensionStrings';
import {
  IBasicCardHelpDeskAdaptiveCardExtensionProps,
  IBasicCardHelpDeskAdaptiveCardExtensionState,
  QUICK_VIEW_REGISTRY_ID
} from '../BasicCardHelpDeskAdaptiveCardExtension';

export class CardView extends BaseComponentsCardView<
  IBasicCardHelpDeskAdaptiveCardExtensionProps,
  IBasicCardHelpDeskAdaptiveCardExtensionState,
  ComponentsCardViewParameters
> {
  public get cardViewParameters(): ComponentsCardViewParameters {
    let primaryText: string = strings.CardViewNoTasks;
    if (this.state.tickets.length > 1) {
      primaryText = `${this.state.tickets.length.toString()} ${strings.CardViewTextPlural}`;
    } else {
      primaryText = `${this.state.tickets.length.toString()} ${strings.CardViewTextSingular}`;
    }
    return PrimaryTextCardView({
      cardBar: {
        componentName: 'cardBar',
        title: this.properties.title
      },
      header: {
        componentName: 'text',
        text: primaryText
      },
      body: {
        componentName: 'text',
        text: strings.CardViewDescription
      },
      footer: {
        componentName: 'cardButton',
        title: strings.QuickViewButtonText,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    });
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
