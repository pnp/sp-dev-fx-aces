import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import * as strings from 'PublicHolidaysAdaptiveCardExtensionStrings';
import { PropertyFieldDateTimePicker, DateConvention, PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls';
var PublicHolidaysPropertyPane = /** @class */ (function () {
    function PublicHolidaysPropertyPane() {
    }
    PublicHolidaysPropertyPane.prototype.getPropertyPaneConfiguration = function (properties, context, onPropertyPaneFieldChanged) {
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
                                PropertyPaneTextField('userProfileProperty', {
                                    label: strings.UserProfilePropertyLabel,
                                    onGetErrorMessage: function (value) {
                                        if (value === null || value.length === 0) {
                                            return strings.UserProfilePropertyValidationText;
                                        }
                                    },
                                }),
                                PropertyFieldListPicker('listTitle', {
                                    label: strings.ListTitleFieldLabel,
                                    selectedList: properties.listTitle,
                                    includeHidden: false,
                                    orderBy: PropertyFieldListPickerOrderBy.Title,
                                    disabled: false,
                                    onPropertyChange: onPropertyPaneFieldChanged,
                                    properties: properties,
                                    context: context,
                                    onGetErrorMessage: null,
                                    deferredValidationTime: 0,
                                    listsToExclude: ["Site Assets", "Announcements", "Videos", "Site Pages", "Style Library", "Form Templates", "Documents", "Events"],
                                    key: 'listPickerFieldId'
                                }),
                                PropertyFieldDateTimePicker('limitToDate', {
                                    label: strings.LimitDateTitleFieldLabel,
                                    dateConvention: DateConvention.Date,
                                    initialDate: properties.limitToDate,
                                    onPropertyChange: onPropertyPaneFieldChanged,
                                    properties: properties,
                                    onGetErrorMessage: null,
                                    deferredValidationTime: 0,
                                    key: 'dateTimeFieldId',
                                    showLabels: false
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return PublicHolidaysPropertyPane;
}());
export { PublicHolidaysPropertyPane };
//# sourceMappingURL=PublicHolidaysPropertyPane.js.map