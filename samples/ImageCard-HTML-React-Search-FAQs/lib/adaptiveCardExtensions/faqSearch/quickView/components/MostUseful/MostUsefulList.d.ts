import * as React from "react";
import { IDropdownOption } from "@fluentui/react";
import { ISPFXContext } from "@pnp/sp";
export interface IMostUsefulListProps {
    context: ISPFXContext;
    siteUrl: string;
    listName: string;
    categories: IDropdownOption[];
    faqFilterLabel?: string;
}
declare const MostUsefulList: React.FC<IMostUsefulListProps>;
export default MostUsefulList;
//# sourceMappingURL=MostUsefulList.d.ts.map