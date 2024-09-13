import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { FrequentlyAskedQuestionsPropertyPane } from './FrequentlyAskedQuestionsPropertyPane';
import { FAQ } from '../../types';
import { IReadonlyTheme, ThemeProvider, ThemeChangedEventArgs } from '@microsoft/sp-component-base';


export interface IFrequentlyAskedQuestionsAdaptiveCardExtensionProps {
  title: string;
  mainImage: string;
  faqs: FAQ[];
  allowMultipleExpanded: boolean;
}

export interface IFrequentlyAskedQuestionsAdaptiveCardExtensionState {
  theme: IReadonlyTheme | undefined;
}

const CARD_VIEW_REGISTRY_ID: string = 'FrequentlyAskedQuestions_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'FrequentlyAskedQuestions_QUICK_VIEW';

export default class FrequentlyAskedQuestionsAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IFrequentlyAskedQuestionsAdaptiveCardExtensionProps,
  IFrequentlyAskedQuestionsAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: FrequentlyAskedQuestionsPropertyPane;
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

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'FrequentlyAskedQuestions-property-pane'*/
      './FrequentlyAskedQuestionsPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.FrequentlyAskedQuestionsPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration(this.properties, this.context, this.onPropertyPaneFieldChanged.bind(this));
  }
}
