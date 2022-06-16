import startOfDay from 'date-fns/startOfDay';
import { isEmpty } from 'lodash';

import { Event } from '@microsoft/microsoft-graph-types';
import {
  BaseAdaptiveCardExtension,
} from '@microsoft/sp-adaptive-card-extension-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import {
  IDateTimeFieldValue,
} from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';

import { CardView } from '../../cards/cardView/CardView';
import { QuickView } from '../../cards/quickView/QuickView';
import { Services } from '../../services';
import { MyDayPropertyPane } from './MyDayPropertyPane';

export interface IPropertyControlsTestWebPartProps {
  datetime: IDateTimeFieldValue;
}
let services: Services = undefined;

export interface IMyDayAdaptiveCardExtensionProps {
  title: string;
  date: IDateTimeFieldValue;
  useDate: boolean;
}

export interface IMyDayAdaptiveCardExtensionState {
  userDisplayName: string;
  events: Event[];
  title: string;
  date: string;
  numberItems: string;
}

const CARD_VIEW_REGISTRY_ID: string = "MyDay_CARD_VIEW";
export const QUICK_VIEW_REGISTRY_ID: string = "MyDay_QUICK_VIEW";

export default class MyDayAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IMyDayAdaptiveCardExtensionProps,
  IMyDayAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: MyDayPropertyPane | undefined;

  public async onInit(): Promise<void> {
    services = new Services(this.context);
    await services.init();
    if (isEmpty(this.properties.date) || !this.properties.useDate) {
      const _date = startOfDay(new Date()).toISOString() as any;
      this.properties.date = { value: _date, displayValue: "" };
    }

    this.state = {
      title: this.properties.title,
      events: [],
      userDisplayName: this.context.pageContext.user.displayName,
      date: this.properties.date.value as any,
      numberItems: "0"
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    this._getEvents((this.properties.date.value as any)).then((_events) => {
      this.setState({...this.state, events: _events, numberItems: _events.length.toString() });
    });

    return Promise.resolve();
  }
  protected get iconProperty(): string {
    return require('../../../assets/events.png');
  }

  protected onPropertyPaneFieldChanged = async (propertyPath: string, oldValue: any, newValue: any) => {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    if (propertyPath === "date") {
      const _newValue = newValue.value.toISOString() as any;
      this.properties.date.value = _newValue;
      const events: Event[] = await this._getEvents(_newValue);
      this.setState({ events: events, date: this.properties.date.value as any, numberItems: events.length.toString() });
    }
    this.renderCard();
  }


  private _getEvents = async (isoDate: string): Promise<Event[]> => {
    try {
      const events: Event[] = await services.getEvents((isoDate));
      return events;
    } catch (e) {
      return [{ "subject": `Error ${e}`, start: { "dateTime": new Date().toISOString() } }];
    }
  }

  protected async loadPropertyPaneResources(): Promise<void> {
    const component = await import(
      /* webpackChunkName: 'MyDay-property-pane'*/
      "./MyDayPropertyPane"
    );
    this._deferredPropertyPane = new component.MyDayPropertyPane(
      this.context,
      this.properties,
      this.onPropertyPaneFieldChanged
    );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
