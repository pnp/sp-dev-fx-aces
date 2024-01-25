import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { BasicCardHelpDeskPropertyPane } from './BasicCardHelpDeskPropertyPane';
import { HelpDeskTicket, ListNames } from '../models/helpdesk.models';
import { helpDeskService } from '../services/helpdesk.service';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { EditView } from './quickView/EditView';

export interface IBasicCardHelpDeskAdaptiveCardExtensionProps {
  title: string;
  iconProperty: string;
  bingMapsKey: string;
  listExists: boolean;
  canUpload: boolean;
  currentLat: string;
  currentLong: string;
}

export interface IBasicCardHelpDeskAdaptiveCardExtensionState {
  tickets: HelpDeskTicket[];
  currentIncidentNumber: string;
  errorMessage: string;
}

export const CARD_VIEW_REGISTRY_ID = 'Helpdesk_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID = 'Helpdesk_QUICK_VIEW';
export const EDIT_VIEW_REGISTRY_ID = 'Helpdesk_EDIT_VIEW';

export default class BasicCardHelpDeskAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IBasicCardHelpDeskAdaptiveCardExtensionProps,
  IBasicCardHelpDeskAdaptiveCardExtensionState
> {
  private LOG_SOURCE = "🔶 Help Desk Ticket Listing Adaptive Card Extension";
  private _deferredPropertyPane: BasicCardHelpDeskPropertyPane | undefined;
  private _listExists = false;

  public async onInit(): Promise<void> {
    try {
      this._iconProperty = this.properties.iconProperty;

      //Initialize Service
      await helpDeskService.Init(this.context.serviceScope,this.context);
      if (helpDeskService.ready) {
        helpDeskService.bingMapsAPIKey = this.properties.bingMapsKey;
      }
      //Check if the list to hold the images exists
      this._listExists = await helpDeskService.CheckList(ListNames.HELPDESKLIST);
      // this.properties.listExists = this._listExists;

      if (this._listExists) {
        this.properties.canUpload = await helpDeskService.CanUserUpload(ListNames.HELPDESKLIST);
        this.properties.canUpload = true;
      } else {
        this.properties.canUpload = false;
      }
      
      // const currentLocation = await helpDeskService.GetCurrentLocation();
      // if (currentLocation) {
      //   this.properties.currentLat = currentLocation.coords.latitude;
      //   this.properties.currentLong = currentLocation.coords.longitude;
      // }

      const tickets: HelpDeskTicket[] = await helpDeskService.GetHelpDeskTickets();

      //Set the data into state
      this.state = {
        tickets: tickets,
        currentIncidentNumber: "",
        errorMessage: ""

      };
      //Register the cards
      this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
      this.quickViewNavigator.register(EDIT_VIEW_REGISTRY_ID, () => new EditView());
    } catch (err) {
      console.error(
        `${this.LOG_SOURCE} (onInit) -- Could not initialize ACE. - ${err}`
      );
    }
    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'BasicCardHelpDeskPropertyPane-property-pane'*/
      './BasicCardHelpDeskPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.BasicCardHelpDeskPropertyPane(this._listExists, this.context);
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
  
  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): Promise<void> {
    try {
      if (propertyPath === 'bingMapsKey') {
        helpDeskService.bingMapsAPIKey = newValue;
      } else if (propertyPath === 'library') {
        //let retVal = false;
        //retVal =
          await helpDeskService.DeleteSampleData();
        //retVal = 
        await helpDeskService.AddSampleData();
        //this.renderCard();
        // if (retVal) {
        //   context.propertyPane.refresh();
        // }
        //this.setState({tickets:[]})
      }
    
    }catch(err){
      console.error(`${this.LOG_SOURCE} (onPropertyPaneFieldChanged) - ${err}`);
    }
  }
}
