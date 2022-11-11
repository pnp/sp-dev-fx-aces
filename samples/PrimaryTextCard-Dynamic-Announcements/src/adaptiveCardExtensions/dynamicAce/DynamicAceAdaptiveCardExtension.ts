import { IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType, PropertyPaneLabel, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { DynamicAcePropertyPane } from './DynamicAcePropertyPane';
import spService from './services/spprovider';
import ISPListitem from '../dynamicAce/models/IListItem';
import * as strings from 'DynamicAceAdaptiveCardExtensionStrings';
import { PropertyPaneDescription } from 'DynamicAceAdaptiveCardExtensionStrings';

export interface IDynamicAceAdaptiveCardExtensionProps {
  title: string;
  listName:string;
  iconProperty: string;
  autoRotate:boolean;
}

export interface IDynamicAceAdaptiveCardExtensionState {
  
  items:ISPListitem[];
  currentIndex: any;
  currentitem:ISPListitem;
  clickedview:boolean;
}

const CARD_VIEW_REGISTRY_ID: string = 'DynamicAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'DynamicAce_QUICK_VIEW';

export default class DynamicAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IDynamicAceAdaptiveCardExtensionProps,
  IDynamicAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: DynamicAcePropertyPane | undefined;
  private _spService: spService = null;
  private listItems: ISPListitem[] = [];

  public async  onInit(): Promise<void> {

    this._spService = new spService(this.context);

     //Get the items for the current user;
     this.listItems = await this._spService.getListItems(this.properties.listName);

    console.log(this.listItems);
    this.state = {
      items:this.listItems,
      currentIndex:0,
      currentitem:this.listItems[0],
      clickedview:false
    };

    const fixture = () => {
      if(this.state.clickedview) 
      {
        return;
      }

      let { currentIndex } = this.state;

      currentIndex = currentIndex < (this.state.items.length - 1) ? currentIndex + 1 : 0;
      if(!this.state.clickedview){
      this.setState({
        currentitem:this.state.items[currentIndex],
        currentIndex
      });
      if(!this.state.clickedview) {
      setTimeout(fixture, 4000);
      }
      }
    };

    if(this.properties.autoRotate){
      fixture();
    }

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  public get title(): string {
    return this.properties.title;
  }

  protected get iconProperty(): string {
    return this.properties.iconProperty || require('./assets/SharePointLogo.svg');
  }

  private btnListSchemaCreation(val: any): any {
    const colListColumns = ['CardViewTitle', 'CardViewDescription', 'StartDate', 'EndDate', 'OnCardSelectionType', 'ExternalLinkURL', 'QuickViewAdaptiveCardJSON', 'QuickViewAdaptiveCardData'];
    console.log("colListColumns: ", colListColumns);
    let listName = this.properties.listName;
    console.log("listName: ", listName);

    this._spService._createListwithColumns(listName, colListColumns).then((res) => {
      console.log(res);
      //this.properties.propertyListOperationMessage = result;
      //this.context.propertyPane.refresh();  
      alert(res);

    }).catch(error => {
      console.log("Something went wrong! please contact admin for more information.", error);
      // this.properties.propertyListOperationMessage = "Something went wrong! please contact admin for more information."
      // this.context.propertyPane.refresh(); 
      let errMessage = (error.mesaage || error.Mesaage);
      alert("Something went wrong! please contact admin for more information. "+ errMessage);
    });

  }


  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'DynamicAce-property-pane'*/
      './DynamicAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.DynamicAcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  // protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  //   return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  // }

  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                PropertyPaneTextField('listName', {
                  label: "ListName"
                }),
                PropertyPaneLabel('listName', {
                  text: "Enter list name and use below button to create required list"
                }),
                PropertyPaneButton('propertyListSchemaButton',
                {
                  text: "Create List",
                  buttonType: PropertyPaneButtonType.Primary,
                  onClick: this.btnListSchemaCreation.bind(this)
                }),
                PropertyPaneToggle('autoRotate', {
                  label: "Auto Rotate"
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
