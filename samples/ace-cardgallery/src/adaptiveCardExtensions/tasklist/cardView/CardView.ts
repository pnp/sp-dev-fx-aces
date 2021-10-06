import {
  BasePrimaryTextCardView,
  IPrimaryTextCardParameters,
  ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'TasklistAdaptiveCardExtensionStrings';
import { ITasklistAdaptiveCardExtensionProps, ITasklistAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../TasklistAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<ITasklistAdaptiveCardExtensionProps, ITasklistAdaptiveCardExtensionState> {
  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID
          }
        }
      }
    ];
  }

  public get data(): IPrimaryTextCardParameters {
    return {
      primaryText: `${this.state.taskList.tasks.length} ${strings.PrimaryText}`,
      description: this.properties.description
    };
  }
}
