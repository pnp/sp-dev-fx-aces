import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView, QuickViewWithButton } from './quickView/QuickView';
import { AceFormsPropertyPane } from './AceFormsPropertyPane';
import { fetchListItems, fetchListTitle } from './services/sp.service';
import { ListItem } from './models/models';

export interface IAceFormsAdaptiveCardExtensionProps {
  title: string;
  description: string;
  listId:string;
  siteURL: string;
  showAllItems: boolean;
  buttonText: string;
  allItemsURL: string;
}

export interface IAceFormsAdaptiveCardExtensionState {
  listTitle: string;
  listItems: ListItem[];
}

const CARD_VIEW_REGISTRY_ID: string = 'AceForms_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'AceForms_QUICK_VIEW';

export default class AceFormsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IAceFormsAdaptiveCardExtensionProps,
  IAceFormsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: AceFormsPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      listTitle: '',
      listItems: []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

    if(this.properties.showAllItems)
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickViewWithButton())
    else
      this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView())


    if (this.properties.listId && this.properties.siteURL) {
      Promise.all([  
        this.setState({ listTitle: await fetchListTitle(this.context, this.properties.listId, this.properties.siteURL) }),
        this.setState({ listItems: await fetchListItems(this.context, this.properties.listId, this.properties.siteURL) })
      ]);
    }

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      './AceFormsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.AceFormsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'listId' && newValue !== oldValue) {
      if (newValue) {
        (async () => {
          this.setState({ listTitle: await fetchListTitle(this.context, newValue, this.properties.siteURL) });
          this.setState({ listItems: await fetchListItems(this.context, newValue, this.properties.siteURL) });
        })();
      } else {
        this.setState({ listTitle: '' });
        this.setState({ listItems: [] });
      }
    }

    if (propertyPath === 'siteURL' && newValue !== oldValue) {
      if (newValue) {
        (async () => {
          this.setState({ listTitle: await fetchListTitle(this.context, this.properties.listId, newValue) });
          this.setState({ listItems: await fetchListItems(this.context, this.properties.listId, newValue) });
        })();
      } else {
        this.setState({ listTitle: '' });
        this.setState({ listItems: [] });
      }
    }
  }
}
