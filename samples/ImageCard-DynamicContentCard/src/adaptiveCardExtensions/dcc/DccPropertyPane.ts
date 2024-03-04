import { IPropertyPaneConfiguration, PropertyPaneTextField,PropertyPaneButton,PropertyPaneLink ,PropertyPaneLabel } from '@microsoft/sp-property-pane';
import * as strings from 'DccAdaptiveCardExtensionStrings';
import { createList } from './sp.service';
import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';

export class DccPropertyPane {
  
  public getPropertyPaneConfiguration(listLink: string, listcreated:boolean, spContext:AdaptiveCardExtensionContext): IPropertyPaneConfiguration {


    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneLabel('createListLabel', {
                  text: strings.createListLabel
                }),
                PropertyPaneButton('createListButton', {
                  text: strings.createListButton,
                  buttonType: 1,
                  disabled: listcreated,
                  onClick: async () => {
                    await createList(spContext);
                  }
                }),
                PropertyPaneLabel('listLinkLabel', {
                  text: strings.listLinkLabel
                }),
                PropertyPaneLink('listLink', {
                  text: strings.listLink,
                  disabled: !listcreated,
                  href:  listLink,
                  target: '_blank'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
