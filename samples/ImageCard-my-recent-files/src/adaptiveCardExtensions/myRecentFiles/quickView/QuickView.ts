import {
  BaseAdaptiveCardView,
  ISPFxAdaptiveCard,
} from '@microsoft/sp-adaptive-card-extension-base';

import { IFiles } from '../../../models';
import {
  IMyRecentFilesAdaptiveCardExtensionProps,
  IMyRecentFilesAdaptiveCardExtensionState,
} from '../MyRecentFilesAdaptiveCardExtension';

export interface IQuickViewData {

  title: string;
  files: IFiles[];
}

export class QuickView extends BaseAdaptiveCardView<
  IMyRecentFilesAdaptiveCardExtensionProps,
  IMyRecentFilesAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    return {
      title:this.properties.title,
      files: this.state.files,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require("./template/QuickViewTemplate.json");
  }
}
