import * as React from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";

interface ICategoryDropdownProps {
  categories: IDropdownOption[];
  selectedCategory: string;
  onCategoryChange: (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => void;
  label?: string; // Optional label
  placeholder?: string; // New optional placeholder prop
}

const CategoryDropdown: React.FC<ICategoryDropdownProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  label = "Filter by Category",
  placeholder = "All Categories", // Default to "All Categories" unless specified otherwise
}) => {
  const options = [{ key: "", text: placeholder }, ...categories]; // Prepend placeholder option

  return (
    <Dropdown
      label={label}
      options={options}
      selectedKey={selectedCategory || ""} // Use empty key if nothing is selected
      onChange={onCategoryChange}
      placeholder={selectedCategory ? undefined : placeholder} // Set placeholder only if no category is selected
    />
  );
};

export default React.memo(CategoryDropdown);
