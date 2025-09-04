import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'PlanTrackerAdaptiveCardExtensionStrings';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { IPlanTrackerAdaptiveCardExtensionProps } from './PlanTrackerAdaptiveCardExtension';

export class PlanTrackerPropertyPane {
  constructor(private properties: IPlanTrackerAdaptiveCardExtensionProps) {}

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel,
                  description: 'The title displayed on the card.'
                }),
                PropertyPaneTextField('planId', {
                  label: 'Planner Plan ID',
                  description: 'The unique identifier of the Planner plan to track.'
                }),
                PropertyPaneTextField('iconProperty', {
                  label: 'Card Icon',
                  description: 'The name of the icon to display on the card.'
                }),
                PropertyFieldCollectionData('statusCollection', {
                  key: 'statusCollection',
                  label: 'Status Mapping',
                  panelHeader: 'Configure Task Status Colors',
                  manageBtnLabel: 'Edit',
                  value: this.properties.statusCollection ?? [],
                  fields: [
                    {
                      id: 'name',
                      title: 'Name',
                      type: CustomCollectionFieldType.string,
                      disable: () => true,
                    },
                    {
                      id: 'shortName',
                      title: 'Short Name',
                      type: CustomCollectionFieldType.string,
                      required: true
                    },
                    {
                      id: 'color',
                      title: 'Color',
                      type: CustomCollectionFieldType.string,
                      required: true,
                    }
                  ],
                  disabled: false,
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
