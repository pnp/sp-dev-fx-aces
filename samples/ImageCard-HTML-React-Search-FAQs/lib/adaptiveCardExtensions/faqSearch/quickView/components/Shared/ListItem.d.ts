import * as React from "react";
import { ISPFXContext } from "@pnp/sp";
export interface IListItemProps {
    item: {
        Id: number;
        Title: string;
        Answer: string;
        HelpfulCount: number;
    };
    listName: string;
    context: ISPFXContext;
}
declare const ListItem: React.FC<IListItemProps>;
export default ListItem;
//# sourceMappingURL=ListItem.d.ts.map