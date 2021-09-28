import {
  BaseBasicCardView,
  IBasicCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AgendaAdaptiveCardExtensionStrings';
import { Agenda } from '../../../models/cg.models';
import { IAgendaAdaptiveCardExtensionProps, IAgendaAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../AgendaAdaptiveCardExtension';

export class CardView extends BaseBasicCardView<IAgendaAdaptiveCardExtensionProps, IAgendaAdaptiveCardExtensionState> {
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

  public get data(): IBasicCardParameters {
    const agenda: Agenda = this.state.agendas[this.state.currentIndex];
    return {
      primaryText: agenda.subject
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
