import {
    BaseImageCardView,
    IImageCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PublicHolidaysAdaptiveCardExtensionStrings';
import { IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState } from '../PublicHolidaysAdaptiveCardExtension';

export class SetupCardView extends BaseImageCardView<IPublicHolidaysAdaptiveCardExtensionProps, IPublicHolidaysAdaptiveCardExtensionState> {
    public get data(): IImageCardParameters {
        return {
            title: strings.SetupRequiredText,
            primaryText: strings.SetPublicHolidaysListText,
            imageUrl: require('../assets/PublicHoliday.jpg')
        };
    }
}