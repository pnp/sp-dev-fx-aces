import * as React from 'react';
import { ISPFXContext } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";
interface IQuickViewComponentProps {
    context: ISPFXContext;
    listName: string;
}
declare const QuickViewComponent: React.FC<IQuickViewComponentProps>;
export default QuickViewComponent;
//# sourceMappingURL=QuickViewComponent.d.ts.map