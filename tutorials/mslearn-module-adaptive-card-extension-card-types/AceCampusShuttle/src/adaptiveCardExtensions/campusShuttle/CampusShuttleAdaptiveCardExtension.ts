import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { CampusShuttlePropertyPane } from './CampusShuttlePropertyPane';
import {
  IListItem,
  fetchListItem,
  STATUS_AVAILABLE
} from './sp.service';
import {
  StartTrip,
  SetOrigin,
  SetDestination,
  SaveTrip,
  UpdateTrip,
  ConfirmationQuickView
} from './quickView';

export interface ICampusShuttleAdaptiveCardExtensionProps {
  title: string;
  listId: string;
}

export interface ICampusShuttleAdaptiveCardExtensionState {
  currentTrip: IListItem;
}

const CARD_VIEW_REGISTRY_ID: string = 'CampusShuttle_CARD_VIEW';
export const QUICK_VIEW_START_TRIP_REGISTRY_ID: string = 'CampusShuttle_StartTrip_QUICK_VIEW';
export const QUICK_VIEW_SET_ORIGIN_REGISTRY_ID: string = 'CampusShuttle_SetOrigin_QUICK_VIEW';
export const QUICK_VIEW_SET_DESTINATION_REGISTRY_ID: string = 'CampusShuttle_SetDestination_QUICK_VIEW';
export const QUICK_VIEW_SAVE_TRIP_REGISTRY_ID: string = 'CampusShuttle_SaveTrip_QUICK_VIEW';
export const QUICK_VIEW_CANCEL_TRIP_REGISTRY_ID: string = 'CampusShuttle_CancelTrip_QUICK_VIEW';
export const QUICK_VIEW_COMPLETE_TRIP_REGISTRY_ID: string = 'CampusShuttle_CompleteTrip_QUICK_VIEW';
export const QUICK_VIEW_UPDATE_TRIP_REGISTRY_ID: string = 'CampusShuttle_UpdateTrip_QUICK_VIEW';

export default class CampusShuttleAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ICampusShuttleAdaptiveCardExtensionProps,
  ICampusShuttleAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: CampusShuttlePropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      currentTrip: {
        Title: this.context.pageContext.user.loginName,
        Status: STATUS_AVAILABLE
      }
    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_START_TRIP_REGISTRY_ID, () => new StartTrip());
    this.quickViewNavigator.register(QUICK_VIEW_CANCEL_TRIP_REGISTRY_ID, () => new ConfirmationQuickView('cancel'));
    this.quickViewNavigator.register(QUICK_VIEW_COMPLETE_TRIP_REGISTRY_ID, () => new ConfirmationQuickView('complete'));
    this.quickViewNavigator.register(QUICK_VIEW_UPDATE_TRIP_REGISTRY_ID, () => new UpdateTrip());
    this.quickViewNavigator.register(QUICK_VIEW_SET_ORIGIN_REGISTRY_ID, () => new SetOrigin());
    this.quickViewNavigator.register(QUICK_VIEW_SET_DESTINATION_REGISTRY_ID, () => new SetDestination());
    this.quickViewNavigator.register(QUICK_VIEW_SAVE_TRIP_REGISTRY_ID, () => new SaveTrip());

    if (this.properties.listId) {
      const trip = await fetchListItem(this.context, this.properties.listId);
      if (trip) { this.setState({ currentTrip: trip }); }
    }

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'CampusShuttle-property-pane'*/
      './CampusShuttlePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.CampusShuttlePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration() ?? super.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string): void {
    if (propertyPath === 'listId' && newValue !== oldValue) {
      if (newValue) {
        (async () => {
          const trip = await fetchListItem(this.context, this.properties.listId);
          if (trip) { this.setState({ currentTrip: trip }); }
        })().catch(console.error);
      }
    }
  }
}
