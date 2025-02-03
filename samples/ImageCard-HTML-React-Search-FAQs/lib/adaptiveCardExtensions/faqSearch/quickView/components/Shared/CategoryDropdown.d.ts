import * as React from "react";
import { IDropdownOption } from "@fluentui/react";
interface ICategoryDropdownProps {
    categories: IDropdownOption[];
    selectedCategory: string;
    onCategoryChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
    label?: string;
    placeholder?: string;
}
declare const _default: React.NamedExoticComponent<ICategoryDropdownProps>;
export default _default;
//# sourceMappingURL=CategoryDropdown.d.ts.map