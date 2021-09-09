import {
    BasePrimaryTextCardView,
    IPrimaryTextCardParameters
} from '@microsoft/sp-adaptive-card-extension-base';

import {
    INewsGlanceAdaptiveCardExtensionProps,
    INewsGlanceAdaptiveCardExtensionState,
} from '../NewsGlanceAdaptiveCardExtension';

export class ErrorCardView extends BasePrimaryTextCardView<INewsGlanceAdaptiveCardExtensionProps, INewsGlanceAdaptiveCardExtensionState> {

    public get data(): IPrimaryTextCardParameters {
        return {
            title: "What have you done!?",
            primaryText: "Error",
            description: this.state.errorMessage,
            iconProperty: "Error"
        };
    }
}