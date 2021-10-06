import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'AgendaAdaptiveCardExtensionStrings';
import { Agenda } from '../../../models/cg.models';
import { IAgendaAdaptiveCardExtensionProps, IAgendaAdaptiveCardExtensionState } from '../AgendaAdaptiveCardExtension';

export interface IQuickViewData {
  agenda: Agenda;
}

export class QuickView extends BaseAdaptiveCardView<
  IAgendaAdaptiveCardExtensionProps,
  IAgendaAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    const agenda: Agenda = this.state.agendas[this.state.currentIndex];
    return {
      agenda: agenda
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}