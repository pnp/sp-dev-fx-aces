var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BasePrimaryTextCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'WordOfTheDayAdaptiveCardExtensionStrings';
import { QUICK_VIEW_REGISTRY_ID } from '../WordOfTheDayAdaptiveCardExtension';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardButtons", {
        get: function () {
            var buttons = [];
            if (this.state.wordOfTheDay) {
                buttons.push({
                    title: strings.QuickViewButton,
                    action: {
                        type: 'QuickView',
                        parameters: {
                            view: QUICK_VIEW_REGISTRY_ID
                        }
                    }
                });
            }
            return buttons;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "data", {
        get: function () {
            var primaryText = strings.Loading;
            var description = strings.Loading;
            if (this.state.wordOfTheDay) {
                primaryText = this.state.wordOfTheDay.word;
                // Uppercase first letter
                primaryText = primaryText[0].toUpperCase() + primaryText.slice(1);
                if (this.state.wordOfTheDay.note
                    && this.state.wordOfTheDay.note.length
                    && this.cardSize == 'Large') {
                    description = "" + this.state.wordOfTheDay.note;
                }
                else {
                    description = strings.Definitions + " " + this.state.wordOfTheDay.definitions.length + "\n\r" + strings.Examples + " " + this.state.wordOfTheDay.examples.length;
                }
            }
            else if (this.state.isError) {
                primaryText = strings.ErrorTitle;
                description = (this.properties.apiKey && this.properties.apiKey.length > 0) ? strings.ErrorGenericDescription : strings.ErrorMissingAPIKeyDescription;
            }
            return {
                primaryText: primaryText,
                description: description
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        get: function () {
            return {
                type: 'ExternalLink',
                parameters: {
                    target: 'https://www.wordnik.com/word-of-the-day'
                }
            };
        },
        enumerable: false,
        configurable: true
    });
    return CardView;
}(BasePrimaryTextCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map