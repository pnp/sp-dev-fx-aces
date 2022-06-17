import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'UserPreviewAdaptiveCardExtensionStrings';
import { PeopleService } from '../../../service/PeopleService';
import { PeopleViewManager } from '../../../viewManager/PeopleViewManager';
import { IUserPreviewAdaptiveCardExtensionProps, IUserPreviewAdaptiveCardExtensionState } from '../UserPreviewAdaptiveCardExtension';
import { BaseQuickView } from './BaseQuickView';

export interface IQuickViewData {
  title: string;
  searchedUsers?: [];
}

export class QuickView extends BaseQuickView<
  IQuickViewData
> {
  constructor(protected viewManager: PeopleViewManager) {
    super(viewManager, "QuickViewTemplate");
  }
}