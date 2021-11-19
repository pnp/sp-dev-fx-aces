import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { HybridWorkCheckinPropertyPane } from './HybridWorkCheckinPropertyPane';
import { IEmployeeCheckinModel } from '../../models/EmployeeCheckin';
import { ICheckinViewModel } from '../../models/CheckinView';
import { MockDataService } from '../../services/MockDataService';
import { HybridWorkCheckinListService } from '../../services/HybridWorkCheckinListService';
import { CheckinCompleteView } from './quickView/CheckinCompleteView';

export interface IHybridWorkCheckinAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IHybridWorkCheckinAdaptiveCardExtensionState {
  employeeCheckinData: IEmployeeCheckinModel | undefined;
  checkInView: ICheckinViewModel | undefined;
  hybridCheckinService: HybridWorkCheckinListService;
}

const CARD_VIEW_REGISTRY_ID: string = 'HybridWorkCheckin_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'HybridWorkCheckin_QUICK_VIEW';
export const CHECKIN_VIEW_REGISTRY_ID: string = 'HybridWorkCheckin_CheckIn_VIEW';

export default class HybridWorkCheckinAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHybridWorkCheckinAdaptiveCardExtensionProps,
  IHybridWorkCheckinAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HybridWorkCheckinPropertyPane | undefined;

  public onInit(): Promise<void> {
    this.state = {
      employeeCheckinData: undefined,
      checkInView: undefined,
      hybridCheckinService: new HybridWorkCheckinListService(this.context)
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    this.quickViewNavigator.register(CHECKIN_VIEW_REGISTRY_ID, () => new CheckinCompleteView());

    const defaultData = new MockDataService();
    return defaultData.getDefaultCheckInData().then((d) => {
      this.setState({
        checkInView: { ...d, UserIdentifier: this.context.pageContext.user.displayName }
      });
    });
    // return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'HybridWorkCheckin-property-pane'*/
      './HybridWorkCheckinPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.HybridWorkCheckinPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
