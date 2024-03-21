import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';

import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { DccPropertyPane } from './DccPropertyPane';
import { testlist,IListInfo, IListItem , fetchListItems } from './sp.service';
import { graphfi, SPFx } from "@pnp/graph";
import "@pnp/graph/users";

export interface IDccAdaptiveCardExtensionProps {
  title: string;
  listOdataUrl: string;
  listLink: string;
}

export interface IDccAdaptiveCardExtensionState {
  listcreated: boolean;
  usageLocation: string;
  theme: string;
  listItems: IListItem[];
}

const CARD_VIEW_REGISTRY_ID: string = 'Dcc_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Dcc_QUICK_VIEW';

export default class DccAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IDccAdaptiveCardExtensionProps,
  IDccAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: DccPropertyPane;

  public async onInit(): Promise<void> {
    //init state
    this.state = {
      listcreated: false,
      usageLocation: '',
      listItems: [],
      theme: 'light'
     };
     //test if list is created and update state
     const testList:IListInfo = await testlist(this.context);
     if(testList.listUrl !== ''){
       this.setState({listcreated: true})
       this.properties.listLink = testList.listUrl;
       this.properties.listOdataUrl = testList.odataUrl;
     }
     else{
     this.setState({listcreated: false})
     this.properties.listLink = '';
     this.properties.listOdataUrl = '';
     }
    //get country
    const graph = graphfi().using(SPFx(this.context));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const me = await graph.me.select("usageLocation","displayName")<any>();
    this.setState({ usageLocation: me.usageLocation });

    //get Teams theme
    await this.context.sdks?.microsoftTeams?.teamsJs.app.getContext().then((context) => {
    this.setState({
      theme: context.app.appInfo.theme
    });
    });
    
    // Get list items if odataUrl is provided
    if (this.properties.listOdataUrl){
      await Promise.all([
        this.setState({ listItems: await fetchListItems(this.context, this.properties.listOdataUrl, this.state.usageLocation)})
      ]);
    }


    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Dcc-property-pane'*/
      './DccPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.DccPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string): Promise<void> {
      //console.log('onPropertyPaneFieldChanged called');
      //console.log(propertyPath);
      if (propertyPath === 'title' && newValue) {
        // update title of the card
        this.properties.title = newValue;
      }

      if (propertyPath === 'createListButton' ) {
        while (!this.state.listcreated){
          //wait 100ms
          await new Promise(resolve => setTimeout(resolve, 100)); 
          //test if list is created and update state
          const testList:IListInfo = await testlist(this.context);
          //console.log('testList');
          //console.log(testList);
          if(testList.listUrl !== ''){
              this.setState({listcreated: true})
              this.properties.listLink = testList.listUrl;
              this.properties.listOdataUrl = testList.odataUrl;
              // refresh property pane
              this.context.propertyPane.refresh();
          }
        }
      }
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    
    return this._deferredPropertyPane?.getPropertyPaneConfiguration(this.properties.listLink, this.state.listcreated, this.context);
  }
}
