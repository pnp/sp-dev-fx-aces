import { ISPFxAdaptiveCard, IActionArguments, /*ISubmitActionArguments*/ BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
// import * as strings from 'PromotePagesAdaptiveCardExtensionStrings';
import { ERROR_VIEW_REGISTRY_ID, IPromotePagesAdaptiveCardExtensionProps, IPromotePagesAdaptiveCardExtensionState, LOADING_VIEW_REGISTRY_ID, SUCCESS_VIEW_REGISTRY_ID } from '../PromotePagesAdaptiveCardExtension';
// import * as _ from "lodash";
import { GraphSitePage } from '../../types';
// import { format } from 'date-fns';
import { IPageHandler, PageHandler } from './../../PageHandler';
import { GraphService, IGraphService } from '../../GraphService';

export interface IPromoteViewData {
  page: GraphSitePage;
}

export class PromoteView extends BaseAdaptiveCardView <
IPromotePagesAdaptiveCardExtensionProps,
IPromotePagesAdaptiveCardExtensionState,
IPromoteViewData
> {
  public get data(): IPromoteViewData {

    const { pages, currentPage } = this.state;

    return {
      page: currentPage.id !== "" ? pages.filter(s => s.id === currentPage.id)[0] : this.state.pages[0]
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/PromoteViewTemplate.json');
  }

  public get title(): string {
    return "Promote pages";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async onAction(action: IActionArguments | any): Promise<void> {
    const handler: IPageHandler = new PageHandler();
    const service: IGraphService = new GraphService(this.context)
    const staticPages = this.state.pages;
    try{
      if (action.id === "Submit") {
        this.quickViewNavigator.replace(LOADING_VIEW_REGISTRY_ID);
        const promoted =  await handler._promotePage(service,this.data.page);
        if(promoted){
          this.quickViewNavigator.replace(SUCCESS_VIEW_REGISTRY_ID);
          this.setState({
            pages: staticPages.filter(p => p.id !== this.data.page.id)
          });
        } else {
          this.quickViewNavigator.replace(ERROR_VIEW_REGISTRY_ID);
        }
      }
    }catch (error){
      this.quickViewNavigator.replace(ERROR_VIEW_REGISTRY_ID);
      console.warn("An error occured", error);
    }
  }
}