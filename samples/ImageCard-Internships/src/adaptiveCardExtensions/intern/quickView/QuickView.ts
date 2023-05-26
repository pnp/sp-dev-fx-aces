/* eslint-disable @typescript-eslint/no-var-requires */
import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'InternAdaptiveCardExtensionStrings';
import { IInternAdaptiveCardExtensionProps, IInternAdaptiveCardExtensionState } from '../InternAdaptiveCardExtension';
import { IQuickViewInternData ,IQuickViewAllInternData} from '../../intern/models/IQuickViewInternData';


export interface IQuickViewData {
    title: string;
    subTitle: string;
    newHeader: string;
    recentHeader: string;
    newInternData: IQuickViewInternData[];   
    recentInternData: IQuickViewInternData[];       
  
  }

export class QuickView extends BaseAdaptiveCardView<
  IInternAdaptiveCardExtensionProps,
  IInternAdaptiveCardExtensionState,
  IQuickViewData
> {
  
  public get data(): IQuickViewData {

    const allTabData : IQuickViewAllInternData  =  require('../../intern/models/quick-view-sample-data.json');

//     var newTabInterndata: IQuickViewInternData[] =
//     [
//    {
//     "companyName": "Accenture",
//     "internshipMode": "Remote | San Francisco",
//     "description": "Summer Analyst (Intern)",
//     "companyImage": "https://180dc.org/wp-content/uploads/2014/04/accenture-logo.png"
//   },
// {
//  "companyName": "Cisco",
//  "internshipMode": "summar intern analyst",
//  "description": "Marketing/Creative Intern",
//  "companyImage": "https://www.markpollock.com/wp-content/uploads/2021/01/Cisco-logo.png"
//  },
//  {
//   "companyName": "Cisco",
//   "internshipMode": "summar intern analyst",
//   "description": "Marketing/Creative Intern",
//   "companyImage": "https://www.markpollock.com/wp-content/uploads/2021/01/Cisco-logo.png"
//   },
//   {
//     "companyName": "Cisco",
//     "internshipMode": "summar intern analyst",
//     "description": "Marketing/Creative Intern",
//     "companyImage": "https://www.markpollock.com/wp-content/uploads/2021/01/Cisco-logo.png"
//     }

//  ];
//  var recentTabInterndata: IQuickViewInternData[] =
//     [
//    {
//       "companyName": "Ansys",
// 			 "internshipMode": "DevOps Engineer Intern",
// 			 "description": "Seattle,WA",
// 			 "companyImage": "https://www.drivingvisionnews.com/wp-content/uploads/2020/11/ansys-logo.jpg"
//   },
//   {
//     "companyName": "Ansys",
//      "internshipMode": "DevOps Engineer Intern",
//      "description": "Seattle,WA",
//      "companyImage": "https://www.drivingvisionnews.com/wp-content/uploads/2020/11/ansys-logo.jpg"
// }
//  ];
    return {
      subTitle: strings.SubTitle,
      title: strings.Title,
      newHeader: strings.NewInternshipHeader,
      recentHeader: strings.RecentInternshipHeader,  
      newInternData: allTabData.newInternTabData,
      recentInternData: allTabData.recentInternTabData        
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }

}

