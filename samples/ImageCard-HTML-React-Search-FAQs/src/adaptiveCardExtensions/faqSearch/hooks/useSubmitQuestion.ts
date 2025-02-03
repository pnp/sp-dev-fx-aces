import { useState, useCallback } from "react";
import { SPFI } from "@pnp/sp";
import { useSPContext } from "../hooks/useSPContext"; // Assumed you have a context hook for SP

export interface ISubmitQuestionProps {
  question: string;
  category: string; // Add category field
}

export const useSubmitQuestion = (context: any, siteUrl: string, listName: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const submitQuestion = useCallback(
    async ({ question, category }: ISubmitQuestionProps) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const sp: SPFI = useSPContext(context, siteUrl); // Initialize PnPjs with SharePoint context
        const list = sp.web.lists.getByTitle(listName); // Get the list by name

        // Prepare the data to be submitted
        const newItem = {
          Title: question,
          Category: category, 
        };

        // Add a new item to the SharePoint list
        await list.items.add(newItem);

        setSuccess(true); // Mark the submission as successful
      } catch (err) {
        console.error("Error submitting question:", err);
        setError("Failed to submit question.");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    },
    [context, siteUrl, listName]
  );

  // Reset success and error states
  const resetStatus = useCallback(() => {
    setSuccess(false);
    setError(null);
  }, []);

  return { submitQuestion, loading, error, success, resetStatus };
};
