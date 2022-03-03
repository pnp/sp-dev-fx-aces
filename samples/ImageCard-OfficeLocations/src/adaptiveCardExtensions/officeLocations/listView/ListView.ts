import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { IOfficeLocationsAdaptiveCardExtensionProps, IOfficeLocationsAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../OfficeLocationsAdaptiveCardExtension';
import { isEmpty, findIndex } from '@microsoft/sp-lodash-subset';
import { Office } from '../../../types';

export interface IListViewData {
  offices: Office[];
}

export class ListView extends BaseAdaptiveCardView<
IOfficeLocationsAdaptiveCardExtensionProps,
IOfficeLocationsAdaptiveCardExtensionState,
  IListViewData
> {
  public get data(): IListViewData {

    let { offices } = this.state;

    return {
      offices
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/ListViewTemplate.json');
  }

  public get title(): string {
    return this.properties.title;
  }

  public onAction(action: IActionArguments): void {

    const uniqueId = (<ISubmitActionArguments>action).data.uniqueId;
    const currentOfficeIndex = findIndex(this.state.offices, (o: Office) => o.uniqueId === uniqueId);
    this.quickViewNavigator.push(QUICK_VIEW_REGISTRY_ID, true);
    this.setState({
      currentOfficeIndex
    });
  }
}