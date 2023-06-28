import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import { IPeopleSearchAdaptiveCardExtensionProps, IPeopleSearchAdaptiveCardExtensionState } from '../PeopleSearchAdaptiveCardExtension';
import { IPerson } from '../model/IPerson';

export interface IItemQuickViewData {
  person: IPerson;
}

export class ItemQuickView extends BaseAdaptiveCardQuickView<
  IPeopleSearchAdaptiveCardExtensionProps,
  IPeopleSearchAdaptiveCardExtensionState,
  IItemQuickViewData
> {
  public get data(): IItemQuickViewData {
    return {
      person: this.state.selectedPerson || this.state.suggested // we can open either selected Person or suggested Person
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ItemQuickViewTemplate.json');
  }
}