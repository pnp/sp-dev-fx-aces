import * as React from "react";
import { useState, useCallback } from "react";
import { IDropdownOption } from "@fluentui/react";
import CategoryDropdown from "../Shared/CategoryDropdown"; // Shared component
import SearchBar from "../Shared/SearchBar";
import useListItems from "../../../hooks/useListItems";
import ListItem from "../Shared/ListItem";
import { ISPFXContext } from "@pnp/sp";

export interface IFAQListProps {
  context: ISPFXContext;
  siteUrl: string;
  listName: string;
  categories: IDropdownOption[];
  faqFilterLabel: string;
}

const FAQList: React.FC<IFAQListProps> = ({
  context,
  siteUrl,
  listName,
  categories,
  faqFilterLabel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { filteredItems, loading, error } = useListItems(
    context,
    siteUrl,
    listName,
    searchQuery,
    selectedCategory
  );

  const onCategoryChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      if (option) {
        setSelectedCategory(option.key as string);
      }
    },
    []
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <h2>Frequently Asked Questions</h2>
      <div style={{ width: "100%" }}>
        <SearchBar onSearch={handleSearch} />
      </div>
      <CategoryDropdown
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        label={faqFilterLabel}
      />
      <br />

      {/* Loading State */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* No items found */}
      {filteredItems && filteredItems.length === 0 && <p>No FAQs available.</p>}

      {/* Display the first 10 most useful items */}
      {filteredItems &&
        filteredItems.map((item) => (
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

export default FAQList;
