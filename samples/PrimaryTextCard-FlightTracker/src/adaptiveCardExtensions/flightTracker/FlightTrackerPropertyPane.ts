import * as strings from 'FlightTrackerAdaptiveCardExtensionStrings';

import {
  IPropertyPaneConfiguration,
  PropertyPaneSlider,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';

import { IFlightTrackerAdaptiveCardExtensionProps } from '../../models';

export class FlightTrackerPropertyPane {

  private properties:  IFlightTrackerAdaptiveCardExtensionProps = undefined;
  constructor(

    properties: IFlightTrackerAdaptiveCardExtensionProps,

  )  {
    this.properties = properties;

  }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('flightNumber', {
                  label: strings.TitleFieldLabel,
                  value: this.properties?.flightNumber,
                }),

                 PropertyPaneSlider('refreshInterval', {
                  label: strings.RefreshIntervalFieldLabel,
                  min: 1,
                  max: 10,
                  value: this.properties?.refreshInterval ?? 1,
                 }),
              ]
            }
          ]
        }
      ]
    };
  }
}
