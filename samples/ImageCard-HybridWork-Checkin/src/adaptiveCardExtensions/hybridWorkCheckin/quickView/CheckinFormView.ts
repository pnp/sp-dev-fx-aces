import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { CheckinFormTemplateLabels } from '../../../common/Constants';
import { ICheckinPrefillModel } from '../../../models/CheckinPrefill';
import { COMPLETE_VIEW_REGISTRY_ID, IHybridWorkCheckinAdaptiveCardExtensionProps, IHybridWorkCheckinAdaptiveCardExtensionState } from '../HybridWorkCheckinAdaptiveCardExtension';

export interface ICheckinFormData {
  labels: any;
  prefilledData: ICheckinPrefillModel;
}

export class CheckinFormView extends BaseAdaptiveCardView<
  IHybridWorkCheckinAdaptiveCardExtensionProps,
  IHybridWorkCheckinAdaptiveCardExtensionState,
  ICheckinFormData
> {
  public get data(): ICheckinFormData {
    return {
      labels: CheckinFormTemplateLabels,
      prefilledData: this.state.prefilledData
    };

  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/CheckinFormTemplate.json');
  }

  public onAction(action: IActionArguments | any): void {
    const checkinData = {
      Title: action.data.UserName,
      CheckinTill: action.data.ValidUntill,
      WorkLocation: this.state.prefilledData.workOptionItems[action.data.WorkLocationChoice].choice,
      IsVaccinated: action.data.IsVaccinated ?? false,
      NoCovidSymptoms: action.data.HasCovidSymptoms ?? false
    };

    this.state.hybridCheckinService.addCheckin(checkinData).then(result => {
      this.quickViewNavigator.push(COMPLETE_VIEW_REGISTRY_ID);
    });
  }
}