import * as strings from 'MyDayAdaptiveCardExtensionStrings';

import {
  AdaptiveCardExtensionContext,
} from '@microsoft/sp-adaptive-card-extension-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import {
  DateConvention,
  PropertyFieldDateTimePicker,
} from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';

import { IMyDayAdaptiveCardExtensionProps } from './MyDayAdaptiveCardExtension';
import { PropertyFieldToggleWithCallout } from '@pnp/spfx-property-controls';

export class MyDayPropertyPane {
  private context = undefined;

  private onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>;
  private properties: IMyDayAdaptiveCardExtensionProps;
  constructor(
    context: AdaptiveCardExtensionContext,
    properties: IMyDayAdaptiveCardExtensionProps ,
    onPropertyPaneFieldChanged: (propertyPath: string, oldValue: any, newValue: any) => Promise<void>
  ) {
    this.context = context;
    this.properties = properties;
    this.context = context;
    this.onPropertyPaneFieldChanged = onPropertyPaneFieldChanged;
    console.log(properties);
  }
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("title", {
                  label: strings.TitleFieldLabel,
                }),
                PropertyFieldToggleWithCallout('useDate', {
                  label: "Use Date",
                  key: 'Use Date',
                  checked: this.properties.useDate,
                }),
                this.properties.useDate && PropertyFieldDateTimePicker("date", {
                  label: 'Select the date and time',
                  initialDate: this.properties.date,
                  dateConvention: DateConvention.Date,

                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'dateTimeFieldId',
                  showLabels: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

