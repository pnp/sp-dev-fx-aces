import { useState, useCallback } from "react";
import { SPFI } from "@pnp/sp";
import { useSPContext } from "../hooks/useSPContext"; // Assumed context for SP
import { Logger, LogLevel } from "@pnp/logging"; // PnPjs logging

export const useHelpfulCount = (
  context: any,
  listName: string,
  itemId: number,
  initialCount: number
) => {
  const [helpfulCount, setHelpfulCount] = useState<number>(initialCount);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const incrementHelpfulCount = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const sp: SPFI = useSPContext(context); // Initialize PnPjs with SP context
      const list = sp.web.lists.getByTitle(listName); // Get the list by name

      // Fetch current helpful count
      const listItem = await list.items.getById(itemId).select("HelpfulCount")();
      const currentHelpfulCount = listItem.HelpfulCount || 0;

      // Increment helpful count
      const updatedHelpfulCount = currentHelpfulCount + 1;

      // Update the list item
      await list.items.getById(itemId).update({
        HelpfulCount: updatedHelpfulCount,
      });

      // Update the state with the new helpful count
      setHelpfulCount(updatedHelpfulCount);
    } catch (err) {
      Logger.write(
        `Error updating helpful count for item ${itemId}: ${err}`,
        LogLevel.Error
      );
      setError("Failed to update helpful count.");
    } finally {
      setLoading(false);
    }
  }, [context, listName, itemId]);

  return { helpfulCount, incrementHelpfulCount, loading, error };
};
