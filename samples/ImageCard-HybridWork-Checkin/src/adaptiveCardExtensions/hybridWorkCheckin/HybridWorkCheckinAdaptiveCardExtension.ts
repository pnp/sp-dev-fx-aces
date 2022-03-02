import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { CheckinFormView } from './quickView/CheckinFormView';
import { HybridWorkCheckinPropertyPane } from './HybridWorkCheckinPropertyPane';
import { ICheckinPrefillModel } from '../../models/CheckinPrefill';
import { HybridWorkCheckinListService } from '../../services/HybridWorkCheckinListService';
import { CheckinCompleteView } from './quickView/CheckinCompleteView';

export interface IHybridWorkCheckinAdaptiveCardExtensionProps {
  title: string;
  description: string;
  iconProperty: string;
}

export interface IHybridWorkCheckinAdaptiveCardExtensionState {
  userDiplayName?: string;
  prefilledData?: ICheckinPrefillModel;
  hybridCheckinService: HybridWorkCheckinListService;
}

const CARD_VIEW_REGISTRY_ID: string = 'HybridWorkCheckin_CARD_VIEW';
export const FORM_VIEW_REGISTRY_ID: string = 'HybridWorkCheckin_FORM_VIEW';
export const COMPLETE_VIEW_REGISTRY_ID: string = 'HybridWorkCheckin_COMPLETE_VIEW';

export default class HybridWorkCheckinAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IHybridWorkCheckinAdaptiveCardExtensionProps,
  IHybridWorkCheckinAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: HybridWorkCheckinPropertyPane | undefined;

  public onInit(): Promise<void> {
    const listService = new HybridWorkCheckinListService(this.context);

    this.state = {
      userDiplayName: this.context.pageContext.user.displayName,
      prefilledData: undefined,
      hybridCheckinService: listService
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(FORM_VIEW_REGISTRY_ID, () => new CheckinFormView());
    this.quickViewNavigator.register(COMPLETE_VIEW_REGISTRY_ID, () => new CheckinCompleteView());

    //get choice options
    return listService.getWorkLocationOptions().then((d) => {
      if (d.value && d.value.length > 0) {
        const choices = d.value[0].Choices.map((c, index) => ({ choice: c, value: index.toString() }));
        this.setState({
          prefilledData: {
            workOptionItems: choices,
            UserIdentifier: this.context.pageContext.user.displayName
          }
        });
      }
    });
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
