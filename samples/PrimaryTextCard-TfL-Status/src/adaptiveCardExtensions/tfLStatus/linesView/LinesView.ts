import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments, ISubmitActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TfLStatusAdaptiveCardExtensionStrings';
import { Line } from '../../types';
import { setFavouriteLine, star, starFilled } from '../tfl';
import { CARD_VIEW_REGISTRY_ID, ITfLStatusAdaptiveCardExtensionProps, ITfLStatusAdaptiveCardExtensionState } from '../TfLStatusAdaptiveCardExtension';
import { sortBy } from '@microsoft/sp-lodash-subset';


export interface ILinesViewData {
  lines: Line[];
}

export class LinesView extends BaseAdaptiveCardView<
  ITfLStatusAdaptiveCardExtensionProps,
  ITfLStatusAdaptiveCardExtensionState,
  ILinesViewData
> {
  public get data(): ILinesViewData {
    const { lines } = this.state;
    return {
      lines
    };
  }

  public get title(): string {
    return "Staus of all lines";
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/LinesViewTemplate.json');
  }

  public async onAction(action: IActionArguments): Promise<void> {

    let favouritedLineId: string = (<ISubmitActionArguments>action).data.lineId;
    let favouriteUpdated: boolean = await setFavouriteLine(favouritedLineId, this.properties.favLineExtensionName);

    if (favouriteUpdated) {
      let { line, lines } = this.state;

      let currentFavouriteLine: Line = line;
      let newFavouriteLine: Line = lines.find(l => l.id === favouritedLineId);

      currentFavouriteLine.isFavourite = !currentFavouriteLine.isFavourite;
      currentFavouriteLine.favouriteIconSvg = star;
      currentFavouriteLine.columnStyle = "default";

      newFavouriteLine.isFavourite = !newFavouriteLine.isFavourite;
      newFavouriteLine.favouriteIconSvg = starFilled;
      newFavouriteLine.columnStyle = "warning";

      lines = sortBy(lines, l => l.severity === 10);
      lines = sortBy(lines, l => !l.isFavourite);
      
      this.setState({
        line: newFavouriteLine,
        lines
      });
    } else {
      //A card view for showing error
    }

  }
}