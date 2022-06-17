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
import { QUICK_VIEW_REGISTRY_ID } from '../DynamicAceAdaptiveCardExtension';
var CardView = /** @class */ (function (_super) {
    __extends(CardView, _super);
    function CardView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CardView.prototype, "cardButtons", {
        get: function () {
            var buttons = [];
            if (this.state.currentIndex > 0) {
                buttons.push({
                    title: 'Previous',
                    action: {
                        type: 'Submit',
                        parameters: {
                            id: 'previous'
                        }
                    }
                });
            }
            if (this.state.currentIndex < this.state.items.length - 1) {
                buttons.push({
                    title: 'Next',
                    action: {
                        type: 'Submit',
                        parameters: {
                            id: 'next'
                        }
                    }
                });
            }
            return buttons;
        },
        enumerable: false,
        configurable: true
    });
    CardView.prototype.onAction = function (action) {
        if (action.type === 'Submit') {
            var _a = action.data, id = _a.id, op = _a.op;
            switch (id) {
                case 'previous': {
                    this.setState({ currentIndex: this.state.currentIndex - 1, currentitem: this.state.items[this.state.currentIndex - 1] });
                    break;
                }
                case 'next': {
                    this.setState({ currentIndex: this.state.currentIndex + 1, currentitem: this.state.items[this.state.currentIndex + 1] });
                    break;
                }
                case 'default': { }
            }
        }
    };
    Object.defineProperty(CardView.prototype, "data", {
        get: function () {
            if (this.state.items.length > 0) {
                return {
                    primaryText: this.state.items[this.state.currentIndex].CardViewTitle,
                    description: this.state.items[this.state.currentIndex].CardViewDescription
                };
            }
            else {
                return {
                    primaryText: "No card for today",
                    description: "Have a beautiful day"
                };
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CardView.prototype, "onCardSelection", {
        get: function () {
            if (this.state.currentitem && this.state.currentitem.OnCardSelectionType == "QuickView") {
                //this.setState({clickedview:true})
                return {
                    type: 'QuickView',
                    parameters: {
                        view: QUICK_VIEW_REGISTRY_ID
                    }
                };
            }
            else if (this.state.currentitem && this.state.currentitem.OnCardSelectionType == "ExternalLink") {
                return {
                    type: 'ExternalLink',
                    parameters: {
                        target: this.state.currentitem.ExternalLinkURL
                    }
                };
            }
            else if (this.state.currentitem && this.state.currentitem.OnCardSelectionType == "Noaction") {
            }
        },
        enumerable: false,
        configurable: true
    });
    return CardView;
}(BasePrimaryTextCardView));
export { CardView };
//# sourceMappingURL=CardView.js.map