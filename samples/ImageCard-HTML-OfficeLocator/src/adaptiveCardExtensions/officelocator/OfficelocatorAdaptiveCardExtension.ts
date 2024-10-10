import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { OfficelocatorPropertyPane } from './OfficelocatorPropertyPane';
import { IReadonlyTheme, ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';

export interface IOfficelocatorAdaptiveCardExtensionProps {
  title: string; 
  mainImage : string; 
  mapkey: string;
  offices: any[];
}

export interface IOfficelocatorAdaptiveCardExtensionState {
  theme: IReadonlyTheme | undefined;
}

const CARD_VIEW_REGISTRY_ID: string = 'Officelocator_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'Officelocator_QUICK_VIEW';

export default class OfficelocatorAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IOfficelocatorAdaptiveCardExtensionProps,
  IOfficelocatorAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: OfficelocatorPropertyPane;
  private themeProvider: ThemeProvider;
  private theme: IReadonlyTheme | undefined;

  public onInit(): Promise<void> {

    this.themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this.theme = this.themeProvider.tryGetTheme();
    this.themeProvider.themeChangedEvent.add(this, this.handleThemeChangedEvent);

    this.state = { 
      theme: this.theme
    };    

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    return Promise.resolve();
  }

  private handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this.setState({
      theme: args.theme
    });
  }

  public get iconProperty(): string {
    return require('./assets/Advania_Icon_RGB.png');
  }


  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'Officelocator-property-pane'*/
      './OfficelocatorPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.OfficelocatorPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration(
      this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this)
    );
  }
}
