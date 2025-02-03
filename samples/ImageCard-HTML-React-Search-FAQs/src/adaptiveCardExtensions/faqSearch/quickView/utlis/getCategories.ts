import { IDropdownOption } from "@fluentui/react";

// Utility function to transform faqCollectionData to Dropdown options
export const getCategories = (faqCollectionData: any[]): IDropdownOption[] => {
  return faqCollectionData.map((category) => ({
    key: category.Key,    // Use the key from the collection
    text: category.Category  // Use the display name
  }));
};
