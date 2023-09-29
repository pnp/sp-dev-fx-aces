import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'PromotePagesAdaptiveCardExtensionStrings';
import { IPromotePagesAdaptiveCardExtensionProps, IPromotePagesAdaptiveCardExtensionState, PROMOTE_VIEW_REGISTRY_ID } from '../PromotePagesAdaptiveCardExtension';
// import * as _ from "lodash";
import { GraphSitePage } from '../../types';

export interface IPageListViewData {
  pages: GraphSitePage[];
}

export class PageListView extends BaseAdaptiveCardView<
  IPromotePagesAdaptiveCardExtensionProps,
  IPromotePagesAdaptiveCardExtensionState,
  IPageListViewData
> {
  public get data(): IPageListViewData {

    const { pages } = this.state;

    if (pages.length === 0) {
      this.quickViewNavigator.pop();
    }
    return {
      pages
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/PageListViewTemplate.json');
  }

  public get title(): string {
    return "Promote Pages";
  }

  public onAction(action: IActionArguments): void {

    this.quickViewNavigator.push(PROMOTE_VIEW_REGISTRY_ID, true);
    this.setState({
      currentPage: {
        ...this.state.currentPage,
        id: (<ISubmitActionArguments>action).data.page
      }
    });
  }
}