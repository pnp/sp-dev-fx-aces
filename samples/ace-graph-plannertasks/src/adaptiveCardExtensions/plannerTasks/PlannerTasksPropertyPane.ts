import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { IDropdownOption } from 'office-ui-fabric-react';
import * as strings from 'PlannerTasksAdaptiveCardExtensionStrings';
import { PropertyPaneAsyncDropdown } from '../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown';
import { GraphServiceInstance } from '../../services/graphservice';
import { IPlannerTasksAdaptiveCardExtensionProps } from './PlannerTasksAdaptiveCardExtension';

export class PlannerTasksPropertyPane {
  public getPropertyPaneConfiguration(
    properties: IPlannerTasksAdaptiveCardExtensionProps,
    render: () => void,
    context: any,
    onChange: () => Promise<void>): IPropertyPaneConfiguration {  
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('iconProperty', {
                  label: strings.IconPropertyFieldLabel
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                }),
                new PropertyPaneAsyncDropdown('plan', {
                  label: "Select Planner plan",
                  loadOptions: this.loadPlans.bind(this),
                  onPropertyChange: onChange.bind(this),
                  selectedKey: properties.plan
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private loadPlans(): Promise<IDropdownOption[]> {
    return new Promise<IDropdownOption[]>(async (resolve, reject) => {
      
      let options: IDropdownOption[] = [];

      let plans = await GraphServiceInstance.GetPlannerPlans();

      options = plans.map(plan => {
        return {
          key: plan.id,
          text: plan.title
        }
      });
      options.unshift({ key: null, text: 'All' });
      resolve(options);     
    
    });
  }

}
