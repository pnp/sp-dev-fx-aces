import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleDetailsAdaptiveCardExtensionStrings';
import { DIALOGUE_VIEW_REGISTRY_ID, IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState, MESSAGE_VIEW_REGISTRY_ID, UPDATE_VIEW_REGISTRY_ID } from '../PeopleDetailsAdaptiveCardExtension';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { PnPServices } from '../../../Services/PnPServices';

export interface IShowAllViewData {
    people?: any;
}

export class ShowAllView extends BaseAdaptiveCardView<
    IPeopleDetailsAdaptiveCardExtensionProps,
    IPeopleDetailsAdaptiveCardExtensionState,
    IShowAllViewData
> {
    public get data(): IShowAllViewData {
        let people: any[] = this.state.peopleData;

        return {
            people: people
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/ShowAllMediumViewTemplate.json');
    }
}