import {
  BaseImageCardView,
  IImageCardParameters,
  IExternalLinkCardAction,
  IQuickViewCardAction
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'FormsampleAdaptiveCardExtensionStrings';
import { FormSampleImage } from '../../../icons/cg.icons';
import { IFormsampleAdaptiveCardExtensionProps, IFormsampleAdaptiveCardExtensionState, QUICK_VIEW_REGISTRY_ID } from '../FormsampleAdaptiveCardExtension';

export class CardView extends BaseImageCardView<IFormsampleAdaptiveCardExtensionProps, IFormsampleAdaptiveCardExtensionState> {
  public get data(): IImageCardParameters {
    return {
      primaryText: strings.PrimaryText,
      imageUrl: FormSampleImage
    };
  }

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'QuickView',
      parameters: {
        view: QUICK_VIEW_REGISTRY_ID
      }
    };
  }
}
