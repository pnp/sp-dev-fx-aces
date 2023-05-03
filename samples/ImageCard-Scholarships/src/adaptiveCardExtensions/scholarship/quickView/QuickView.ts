import { ISPFxAdaptiveCard, BaseAdaptiveCardView, } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'ScholarshipAdaptiveCardExtensionStrings';
import { IScholarshipAdaptiveCardExtensionProps, IScholarshipAdaptiveCardExtensionState } from '../ScholarshipAdaptiveCardExtension';
import { IQuickViewNewData } from '../../scholarship/models/IQuickViewData';


export interface IQuickViewData {
  subTitle: string;
  title: string;
  newHeader: string;
  recentHeader: string;
  appliedHeader: string;
  newScholarData: IQuickViewNewData[];
  recentScholarData: IQuickViewNewData[];
  appliedScholarData: IQuickViewNewData[];
  seletedNewItemData: any;
  newTabCount: number;
  recentTabCount: number;
  appliedTabCount: number;
}

export class QuickView extends BaseAdaptiveCardView<
  IScholarshipAdaptiveCardExtensionProps,
  IScholarshipAdaptiveCardExtensionState,
  IQuickViewData
> {

  private  sortItemsAccordingToDueDate(datesArray : any[])  {
    let res  = datesArray.sort((date1,date2)=>
    {
        const val1 : any = new Date (date1.deadlineDetails.split("-")[1]);
        const val2  : any= new Date (date2.deadlineDetails.split("-")[1]);
        return  val1 - val2;
    });

    return res;
  }
  public get data(): IQuickViewData {

    const tabsData: any = require('../../scholarship/models/scholarship-sample-data.json');
    const newScholarData : IQuickViewNewData[] = this.sortItemsAccordingToDueDate(tabsData.newTabScholarshipData);
    const recentScholarData : IQuickViewNewData[] = this.sortItemsAccordingToDueDate(tabsData.recentTabScholarshipData);
    const appliedScholarData : IQuickViewNewData[] = this.sortItemsAccordingToDueDate(tabsData.appliedTabScholarshipData);
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      newHeader: strings.NewScholarshipHeader,
      recentHeader: strings.RecentScholarshipHeader,
      appliedHeader: strings.AppliedScholarshipsHeader,
      newScholarData: newScholarData,
      recentScholarData: recentScholarData,
      appliedScholarData: appliedScholarData,
      newTabCount: tabsData.newTabScholarshipData.length,
      recentTabCount: tabsData.recentTabScholarshipData.length,
      appliedTabCount: tabsData.appliedTabScholarshipData.length,
      seletedNewItemData: tabsData.selectedNewTabItemDetails
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}