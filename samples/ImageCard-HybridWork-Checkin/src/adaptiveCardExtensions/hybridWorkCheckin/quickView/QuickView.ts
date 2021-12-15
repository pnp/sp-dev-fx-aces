import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import { ICheckinViewModel } from '../../../models/CheckinView';
import { WorkLocationOptions } from '../../../services/MockDataService';
import { CHECKIN_VIEW_REGISTRY_ID, IHybridWorkCheckinAdaptiveCardExtensionProps, IHybridWorkCheckinAdaptiveCardExtensionState } from '../HybridWorkCheckinAdaptiveCardExtension';

export class QuickView extends BaseAdaptiveCardView<
  IHybridWorkCheckinAdaptiveCardExtensionProps,
  IHybridWorkCheckinAdaptiveCardExtensionState,
  ICheckinViewModel
> {
  public get data(): ICheckinViewModel {
    return {
      UserIdentifier: this.state.checkInView.UserIdentifier,
      Survey: this.state.checkInView.Survey
    };

  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/CheckinFormTemplate.json');
  }

  public onAction(action: IActionArguments | any): void {
    console.log(action.data);

    const checkinData = {
      Title: this.state.hybridCheckinService._context.pageContext.user.displayName,
      CheckinTill: action.data.ValidUntill,
      WorkLocation: WorkLocationOptions[action.data.WorkLocationChoice - 1].choice,
      IsVaccinated: action.data.IsVaccinated,
      NoCovidSymptoms: action.data.HasCovidSymptoms
    };

    this.state.hybridCheckinService.addCheckin(checkinData).then(result => {
      console.log(result);
      this.quickViewNavigator.push(CHECKIN_VIEW_REGISTRY_ID);
    });
  }

}