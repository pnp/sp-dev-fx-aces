import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'StockBitcoinFeedAdaptiveCardExtensionStrings';
var StockBitcoinFeedPropertyPane = /** @class */ (function () {
    function StockBitcoinFeedPropertyPane() {
    }
    StockBitcoinFeedPropertyPane.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: strings.PropertyPaneDescription },
                    groups: [
                        {
                            groupFields: [
                                PropertyPaneTextField('title', {
                                    label: strings.TitleFieldLabel
                                }),
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                }),
                                PropertyPaneTextField('finnhubtoken', {
                                    label: strings.Finnhubtoken
                                }),
                                PropertyPaneTextField('finnhubsymbol', {
                                    label: strings.Finnhubsymbol
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return StockBitcoinFeedPropertyPane;
}());
export { StockBitcoinFeedPropertyPane };
//# sourceMappingURL=StockBitcoinFeedPropertyPane.js.map