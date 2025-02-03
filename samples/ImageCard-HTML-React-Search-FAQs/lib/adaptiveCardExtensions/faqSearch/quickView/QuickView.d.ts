import { BaseWebQuickView } from "@microsoft/sp-adaptive-card-extension-base";
import { IFaqSearchAdaptiveCardExtensionProps, IFaqSearchAdaptiveCardExtensionState } from "../FaqSearchAdaptiveCardExtension";
export declare class QuickView extends BaseWebQuickView<IFaqSearchAdaptiveCardExtensionProps, IFaqSearchAdaptiveCardExtensionState> {
    /**
     * Renders the QuickView by mounting the FAQs React component into the DOM.
     */
    render(): void;
    /**
     * Cleans up resources when the QuickView is disposed by unmounting the React component.
     */
    onDispose(): void;
}
//# sourceMappingURL=QuickView.d.ts.map