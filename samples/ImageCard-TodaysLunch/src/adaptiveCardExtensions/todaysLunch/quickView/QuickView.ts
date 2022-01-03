import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IExternalLinkParameters, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TodaysLunchAdaptiveCardExtensionStrings';
import { ILunches } from '../models/ILunch';
import { ITodaysLunchAdaptiveCardExtensionProps, ITodaysLunchAdaptiveCardExtensionState } from '../TodaysLunchAdaptiveCardExtension';
import { Logger, LogLevel } from "@pnp/logging";

export interface IQuickViewData {
  subTitle: string;
  title: string;
  description: string;
  calories: string;
}

export class QuickView extends BaseAdaptiveCardView<
  ITodaysLunchAdaptiveCardExtensionProps,
  ITodaysLunchAdaptiveCardExtensionState,
  IQuickViewData
> {
  private LOG_SOURCE: string = "🔶 QuickView";

  public get data(): IQuickViewData {
    Logger.write(`${this.LOG_SOURCE} (data) - ${this.state.todaysLunch} - ${this.state.todaysLunch.lunches}`, LogLevel.Info);

    const iLunches: ILunches = this.state.todaysLunch;
    const idx: number = this.state.idx;

    return {
      subTitle: iLunches.lunches[idx].shortDescription,
      title: iLunches.lunches[idx].title,
      description: iLunches.lunches[idx].formattedDishes,
      calories: `**Calories**: ${iLunches.lunches[idx].calories}`
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplateSlider.json');
  }

  public get externalLink(): IExternalLinkParameters | undefined {
    return {
      target: this.state.todaysLunch.lunches[this.state.idx].seeMore
    };
  }

  public async onAction(action: IActionArguments): Promise<void> {
    try {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${action.id} - ${action.type}`, LogLevel.Info);
      if (action.type === 'Submit') {
        Logger.write(`${this.LOG_SOURCE} (onAction) - ${action.data.id},${action.id},${action.type}`, LogLevel.Info);
        const { id, newIndex } = action.data;
        if (id === 'previous') {
          let newidx = this.state.idx;
          if (newidx > 0) {
            newidx--;
          }
          this.setState({ idx: newidx });
        } else if (id === 'next') {
          let newidx = this.state.idx;
          if (newidx < this.state.todaysLunch.lunches.length) {
            newidx++;
          }
          this.setState({ idx: newidx });
        }
      }
    } catch (err) {
      Logger.write(`${this.LOG_SOURCE} (onAction) - ${err}`, LogLevel.Error);
    }
  }

}