import * as React from "react";
import { ISPFXContext } from "@pnp/sp";
export interface IFAQsProps {
    context: ISPFXContext;
    siteUrl: string;
    faqListName: string;
    submitionListName: string;
    faqCollectionData: any;
    faqFilterLabel: string;
}
declare const FAQs: React.FC<IFAQsProps>;
export default FAQs;
//# sourceMappingURL=FAQs.d.ts.map