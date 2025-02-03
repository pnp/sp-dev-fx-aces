import * as React from "react";
import { IDropdownOption } from "@fluentui/react";
import { ISPFXContext } from "@pnp/sp";
export interface IFAQListProps {
    context: ISPFXContext;
    siteUrl: string;
    listName: string;
    categories: IDropdownOption[];
    faqFilterLabel: string;
}
declare const FAQList: React.FC<IFAQListProps>;
export default FAQList;
//# sourceMappingURL=FAQList.d.ts.map