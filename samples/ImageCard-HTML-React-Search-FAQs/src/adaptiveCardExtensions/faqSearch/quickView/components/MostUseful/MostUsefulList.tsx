import * as React from "react";
import { useState, useCallback } from "react";
import ListItem from "../Shared/ListItem";
import useListItems from "../../../hooks/useListItems";
import CategoryDropdown from "../Shared/CategoryDropdown"; // Import the shared component
import { IDropdownOption } from "@fluentui/react";
import { ISPFXContext } from "@pnp/sp";

export interface IMostUsefulListProps {
  context: ISPFXContext;
  siteUrl: string;
  listName: string;
  categories: IDropdownOption[];
  faqFilterLabel?: string;
}

const MostUsefulList: React.FC<IMostUsefulListProps> = ({
  context,
  siteUrl,
  listName,
  categories,
  faqFilterLabel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { filteredItems, loading, error } = useListItems(
    context,
    siteUrl,
    listName,
    "", // No search query here
    selectedCategory,
    "HelpfulCount" // Sort by helpful count
  );

  const onCategoryChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option) {
        setSelectedCategory(option.key as string);
      }
    },
    []
  );

  return (
    <div>
      <h2>Most Useful Questions</h2>
      <CategoryDropdown
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange} // Pass memoized function
        label={faqFilterLabel} // Pass optional label
      />
      <br />

      {/* Loading State */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* No items found */}
      {filteredItems && filteredItems.length === 0 && (
        <p>No useful questions available.</p>
      )}

      {/* Display the first 10 most useful items */}
      {filteredItems &&
        filteredItems
          .slice(0, 10)
          .map((item) => (
            <ListItem
              key={item.Id}
              item={item}
              listName={listName}
              context={context}
            />
          ))}
    </div>
  );
};

export default MostUsefulList;
