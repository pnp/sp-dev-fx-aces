// Utility function to transform faqCollectionData to Dropdown options
export var getCategories = function (faqCollectionData) {
    return faqCollectionData.map(function (category) { return ({
        key: category.Key,
        text: category.Category // Use the display name
    }); });
};
//# sourceMappingURL=getCategories.js.map