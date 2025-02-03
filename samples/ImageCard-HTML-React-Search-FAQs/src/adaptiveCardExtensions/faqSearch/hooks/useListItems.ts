import { useState, useEffect, useCallback } from "react";
import { ISPFXContext } from "@pnp/sp";
import { useSPContext } from "./useSPContext";
import { Logger, LogLevel } from "@pnp/logging"; // Import PnP logging
import "@pnp/sp/webs";
import "@pnp/sp/items";
import "@pnp/sp/lists";

export interface IListItem {
  Id: number;
  Title: string;
  HelpfulCount: number;
  Answer: string;
  Created: any;
  Category: string;
}

interface IUseListItemsResult {
  filteredItems: IListItem[] | null;
  loading: boolean;
  error: string | null;
}

const useListItems = (
  context: ISPFXContext,
  siteUrl: string,
  listName: string,
  searchQuery: string,
  selectedCategory: string,
  sortField: string = "Title" // Default sort by Title
): IUseListItemsResult => {
  const [filteredItems, setFilteredItems] = useState<IListItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sp = useSPContext(context, siteUrl);
      const list = sp.web.lists.getByTitle(listName);

      // Build the filter query based on searchQuery and selectedCategory
      let filterQuery = "";

      if (searchQuery) {
        filterQuery += `substringof('${searchQuery}', Title)`;
      }

      if (selectedCategory) {
        if (filterQuery) filterQuery += " and ";
        filterQuery += `Category eq '${selectedCategory}'`;
      }

      // Default sorting order: ascending for Title, descending for HelpfulCount
      const sortOrder = sortField === "HelpfulCount" ? false : true;

      // Fetch filtered and sorted items
      const listItems = await list.items
        .filter(filterQuery) // Apply filter
        .orderBy(sortField, sortOrder) // Apply sorting
        .top(50)(); // Fetch up to 50 items

      // Update state with fetched items
      setFilteredItems(listItems);
    } catch (err) {
      const errorMessage = `Failed to load items from list: ${listName}. Error: ${err.message}`;
      Logger.write(errorMessage, LogLevel.Error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [context, listName, searchQuery, selectedCategory, sortField]);

  useEffect(() => {
    fetchListItems();
  }, [fetchListItems]);

  return { filteredItems, loading, error };
};

export default useListItems;
