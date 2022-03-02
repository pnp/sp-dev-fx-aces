import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters,
    IExternalLinkCardAction,
    IQuickViewCardAction,
    ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleDetailsAdaptiveCardExtensionStrings';
import {
    CREATE_VIEW_REGISTRY_ID, IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState, READ_VIEW_REGISTRY_ID, SHOWALLMEDIUM_VIEW_REGISTRY_ID
} from '../PeopleDetailsAdaptiveCardExtension';

export class MediumCardView extends BasePrimaryTextCardView<IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState> {
    public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
        return [
            {
                title: "View All People Details",
                action: {
                    type: 'QuickView',
                    parameters: {
                        view: SHOWALLMEDIUM_VIEW_REGISTRY_ID
                    }
                }
            }
        ];
    }

    public get data(): IPrimaryTextCardParameters {
        return {
            primaryText: "People Details ACE",
            description: "Total user details present are " + this.state.peopleData.length
        };
    }

    public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
        return {
            type: 'QuickView',
            parameters: {
                view: SHOWALLMEDIUM_VIEW_REGISTRY_ID
            }
        };
    }
}
