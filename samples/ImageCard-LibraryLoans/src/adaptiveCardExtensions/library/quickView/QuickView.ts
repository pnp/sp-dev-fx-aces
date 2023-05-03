import { ISPFxAdaptiveCard, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import { ILibraryAdaptiveCardExtensionProps, ILibraryAdaptiveCardExtensionState } from '../LibraryAdaptiveCardExtension';
import libraryImg from '../assets/LibraryImg.png';
import { IQuickViewLibraryData } from '../../../models/IQuickViewLibraryData';

export interface IQuickViewData {
  libraryImage: string;
  libraryData: IQuickViewLibraryData[];
}

export class QuickView extends BaseAdaptiveCardView<
  ILibraryAdaptiveCardExtensionProps,
  ILibraryAdaptiveCardExtensionState,
  IQuickViewData
> {

  private sortItemsAccordingToDueDate(datesArray: any[]) {
    let res = datesArray.sort((date1, date2) => {
      const val1: any = new Date(date1.dueDate.substring(3));
      const val2: any = new Date(date2.dueDate.substring(3));
      return val1 - val2;
    });

    return res;
  }

  public get data(): IQuickViewData {

    let libraryJsonData: any = require('../../../models/sample-library-data.json');
    let library: IQuickViewLibraryData[] = this.sortItemsAccordingToDueDate(libraryJsonData.libraryLoansData);
    return {
      libraryImage: libraryImg,
      libraryData: library
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}