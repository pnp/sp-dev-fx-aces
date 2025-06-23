"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardView = void 0;
const sp_adaptive_card_extension_base_1 = require("@microsoft/sp-adaptive-card-extension-base");
const strings = require("AceMyLocationAdaptiveCardExtensionStrings");
class CardView extends sp_adaptive_card_extension_base_1.BaseComponentsCardView {
    get cardViewParameters() {
        return (0, sp_adaptive_card_extension_base_1.BasicCardView)({
            cardBar: {
                componentName: 'cardBar',
                title: this.properties.title
            },
            header: {
                componentName: 'text',
                text: strings.PrimaryText
            },
            footer: {
                componentName: 'cardButton',
                title: this.state.officeUrl ? `Go to ${this.state.officeUrl}` : 'Office Location',
                action: {
                    type: 'ExternalLink',
                    parameters: {
                        target: this.state.officeUrl || 'https://yfv8z.sharepoint.com/sites/dev/' //
                    }
                }
            }
        });
    }
    get onCardSelection() {
        if (this.state.officeUrl) {
            return {
                type: 'ExternalLink',
                parameters: {
                    target: this.state.officeUrl
                }
            };
        }
        return undefined;
    }
}
exports.CardView = CardView;
//# sourceMappingURL=CardView.js.map