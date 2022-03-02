import { ISPFxAdaptiveCard, BaseAdaptiveCardView, IActionArguments } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'PeopleDetailsAdaptiveCardExtensionStrings';
import { IPeopleDetailsAdaptiveCardExtensionProps, IPeopleDetailsAdaptiveCardExtensionState, MESSAGE_VIEW_REGISTRY_ID, READ_VIEW_REGISTRY_ID } from '../PeopleDetailsAdaptiveCardExtension';
import { PnPServices } from '../../../Services/PnPServices';

import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export interface IDialogueViewData {
    message: any;
}

export class DialogueView extends BaseAdaptiveCardView<
    IPeopleDetailsAdaptiveCardExtensionProps,
    IPeopleDetailsAdaptiveCardExtensionState,
    IDialogueViewData
> {
    public get data(): IDialogueViewData {
        let people = this.state.peopleData[this.state.currentIndex];
        let message = "You are going to delete: " + people["title"] + ". If you want to cancel kindly hit the above back button.";
        return {
            message: message,
        };
    }

    public get template(): ISPFxAdaptiveCard {
        return require('./template/DialogueViewTemplate.json');
    }
    public onAction = async (action: IActionArguments) => {
        if (action.type === 'Submit') {
            const { id, newIndex } = action.data;
            let itemId = this.state.peopleData[this.state.currentIndex].itemId;
            let newViewId: number = this.state.currentIndex;
            if (id === 'ConfirmDelete') {
                let deleteStatus: boolean = await PnPServices.deleteItem(itemId);
                if (deleteStatus) {
                    newViewId = 0;
                    let refreshData: any = await PnPServices.refreshData();

                    this.quickViewNavigator.replace(MESSAGE_VIEW_REGISTRY_ID, true);
                    this.setState({
                        peopleData: refreshData["peopleData"],
                        countryData: refreshData["countryData"],
                        currentIndex: newViewId,
                        messageBar: {
                            text: "People deleted successfully",
                            success: true,
                            iconUrl: this.state.imgPath + "checkmark_circle_24_filled.svg",
                            color: "Green"
                        }
                    });
                }
                else {
                    let refreshData: any = await PnPServices.refreshData();
                    let newCurrentIndex: any[] = refreshData["peopleData"].filter(item => item["id"] === newViewId);
                    newViewId = newCurrentIndex.length > 0 ? newCurrentIndex[0]["id"] : 0;
                    this.quickViewNavigator.replace(MESSAGE_VIEW_REGISTRY_ID, true);
                    this.setState({
                        peopleData: refreshData["peopleData"],
                        countryData: refreshData["countryData"],
                        currentIndex: newViewId,
                        messageBar: {
                            text: "Error occured while deleting item",
                            success: false,
                            iconUrl: this.state.imgPath + "error_circle_24_filled.svg",
                            color: "Red"
                        }
                    });
                }
            }
            // this.setState({ currentIndex: newViewId });
        }
    }
}