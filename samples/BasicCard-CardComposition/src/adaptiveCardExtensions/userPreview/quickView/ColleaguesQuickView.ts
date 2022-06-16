import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { PeopleService } from '../../../service/PeopleService';
import { PeopleViewManager } from '../../../viewManager/PeopleViewManager';
import { IUserPreviewAdaptiveCardExtensionProps, IUserPreviewAdaptiveCardExtensionState } from '../UserPreviewAdaptiveCardExtension';
import { BaseQuickView } from './BaseQuickView';

export interface IQuickViewData {
    colleagues?: [];
}

export class ColleaguesQuickView extends BaseQuickView<
    IQuickViewData
> {
    constructor(protected viewManager: PeopleViewManager) {
        super(viewManager, "ColleaguesQuickViewTemplate");
        viewManager.getUsers().then(users => {
            this.setState({colleagues: users});
        });
    }
}