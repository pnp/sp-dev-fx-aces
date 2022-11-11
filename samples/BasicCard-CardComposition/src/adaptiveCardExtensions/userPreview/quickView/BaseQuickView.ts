import { BaseAdaptiveCardView, IActionArguments, ISPFxAdaptiveCard } from "@microsoft/sp-adaptive-card-extension-base";
import { PeopleViewManager } from "../../../viewManager/PeopleViewManager";
import { IUserPreviewAdaptiveCardExtensionProps, IUserPreviewAdaptiveCardExtensionState } from "../UserPreviewAdaptiveCardExtension";

export class BaseQuickView<T> extends BaseAdaptiveCardView<
    IUserPreviewAdaptiveCardExtensionProps,
    IUserPreviewAdaptiveCardExtensionState,
    T
> {
    protected aceSchema: ISPFxAdaptiveCard;
    constructor(protected viewManager: PeopleViewManager, protected baseTemplateName: string) {
        super();
    }
    public get data(): T {
        return {
            ...this.state
        } as T;
    }
    public get template(): ISPFxAdaptiveCard {
        if (!this.aceSchema) {
            let mainAce = require(`./template/${this.baseTemplateName}.json`);
            let userPreview = require('./template/UserPreviewTemplate.json');
            let usersContainer = mainAce.body.find(el => el.dataId === "PeopleSearchResults");
            usersContainer.items.push(...userPreview);
            this.aceSchema = mainAce;
        }
        return this.aceSchema;
    }

    public onAction(action: IActionArguments): void {
        this.viewManager.handleAction(action as any).then(newPartialState => {
            if (newPartialState) {
                this.setState(newPartialState);
            }
        });
    }
}