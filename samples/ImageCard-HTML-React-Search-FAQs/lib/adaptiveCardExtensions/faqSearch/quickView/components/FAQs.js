import * as React from "react";
import { Pivot, PivotItem } from "@fluentui/react";
import SubmitQuestionForm from "./SubmitQuestion/SubmitQuestionsView";
import FAQList from "./FAQ/FAQList";
import MostUsefulList from "./MostUseful/MostUsefulList";
import { getCategories } from "../utlis/getCategories";
// Memoize the FAQs component
var FAQs = React.memo(function (_a) {
    var context = _a.context, siteUrl = _a.siteUrl, faqListName = _a.faqListName, submitionListName = _a.submitionListName, faqCollectionData = _a.faqCollectionData, faqFilterLabel = _a.faqFilterLabel;
    var categories = React.useMemo(function () {
        return getCategories(faqCollectionData);
    }, [faqCollectionData]);
    return (React.createElement("div", { style: { padding: "16px", minWidth: "328px" } },
        React.createElement(Pivot, null,
            React.createElement(PivotItem, { headerText: "FAQs" },
                React.createElement(FAQList, { context: context, siteUrl: siteUrl, listName: faqListName, categories: categories, faqFilterLabel: faqFilterLabel })),
            React.createElement(PivotItem, { headerText: "Most Useful" },
                React.createElement(MostUsefulList, { context: context, siteUrl: siteUrl, listName: faqListName, categories: categories, faqFilterLabel: faqFilterLabel })),
            React.createElement(PivotItem, { headerText: "Submit Question" },
                React.createElement(SubmitQuestionForm, { context: context, siteUrl: siteUrl, listName: submitionListName, categories: categories })))));
});
export default FAQs;
//# sourceMappingURL=FAQs.js.map