import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { LinesView } from './linesView/LinesView';
import { TfLStatusPropertyPane } from './TfLStatusPropertyPane';
import { Line, TfLLine } from '../types';
import { getAllLinesDetails, getFavouriteLine, getLineColour, getLineDetails, mapLine, setFavouriteLine } from './tfl';
import { ErrorCardView } from './cardView/ErrorCardView';
import { SetupCardView } from './cardView/SetupCardView';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { MSGraph } from './msgraph';
import { sortBy } from '@microsoft/sp-lodash-subset';


export interface ITfLStatusAdaptiveCardExtensionProps {
  favLineExtensionName: string;
}

export interface ITfLStatusAdaptiveCardExtensionState {
  line: Line;
  lines: Line[];
  errorMessage: string;
  cardViewToRender: string;
}

export const CARD_VIEW_REGISTRY_ID: string = 'TfLStatus_CARD_VIEW';
export const LINES_VIEW_REGISTRY_ID: string = 'TfLStatus_LINES_VIEW';
const SETUP_CARD_VIEW_REGISTRY_ID: string = 'TfLStatus_SETUP_CARD_VIEW';
const ERROR_CARD_VIEW_REGISTRY_ID: string = 'TfLStatus_ERROR_CARD_VIEW';

export default class TfLStatusAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ITfLStatusAdaptiveCardExtensionProps,
  ITfLStatusAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: TfLStatusPropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      line: null,
      lines: null,
      errorMessage: "",
      cardViewToRender: CARD_VIEW_REGISTRY_ID
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(LINES_VIEW_REGISTRY_ID, () => new LinesView());
    this.cardNavigator.register(SETUP_CARD_VIEW_REGISTRY_ID, () => new SetupCardView());
    this.cardNavigator.register(ERROR_CARD_VIEW_REGISTRY_ID, () => new ErrorCardView());

    await MSGraph.Init(this.context);

    this.getLineDetails();

    return Promise.resolve();
  }

  private async getLineDetails(): Promise<void> {

    if (isEmpty(this.properties.favLineExtensionName)) {
      this.setState({
        cardViewToRender: SETUP_CARD_VIEW_REGISTRY_ID
      });
      this.cardNavigator.replace(this.state.cardViewToRender);
      return;
    }

    setTimeout(async () => {
      const favouriteLineId: string = await getFavouriteLine(this.properties.favLineExtensionName);

      const tflLines: TfLLine[] = await getAllLinesDetails(this.context.httpClient);

      if (tflLines === null) {
        this.setState({
          cardViewToRender: ERROR_CARD_VIEW_REGISTRY_ID,
          errorMessage: "Please check logs"
        });
        this.cardNavigator.replace(this.state.cardViewToRender);
        return;
      }

      let lines: Line[] = tflLines.map(tl => mapLine(tl, favouriteLineId));
      const line: Line = favouriteLineId ? lines.find(tl => tl.id === favouriteLineId) : lines.find(tl => tl.id === "northern");

      if (line === null || line === undefined) {
        this.setState({
          cardViewToRender: ERROR_CARD_VIEW_REGISTRY_ID,
          errorMessage: "Please check logs"
        });
        this.cardNavigator.replace(this.state.cardViewToRender);
        return;
      }

      lines = sortBy(lines, l => l.severity);
      lines = sortBy(lines, l => !l.isFavourite);

      this.setState({
        line,
        lines
      });
    }, 300);
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'TfLStatus-property-pane'*/
      './TfLStatusPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.TfLStatusPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return this.state.cardViewToRender;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }
}
