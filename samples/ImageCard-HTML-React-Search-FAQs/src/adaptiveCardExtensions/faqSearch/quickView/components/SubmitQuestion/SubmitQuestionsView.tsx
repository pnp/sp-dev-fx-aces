import * as React from "react";
import { useState, useEffect } from "react";
import {
  Stack,
  PrimaryButton,
  TextField,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import CategoryDropdown from "../Shared/CategoryDropdown";
import { useSubmitQuestion } from "../../../hooks/useSubmitQuestion";
import { IDropdownOption } from "@fluentui/react";
import { ISPFXContext } from "@pnp/sp";

const SubmitQuestionForm: React.FC<{
  context: ISPFXContext;
  siteUrl: string;
  listName: string;
  categories: IDropdownOption[];
}> = ({ context, siteUrl, listName, categories }) => {
  const { submitQuestion, loading, error, success, resetStatus } =
    useSubmitQuestion(context, siteUrl, listName);
  const [question, setQuestion] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitQuestion({ question, category: selectedCategory });
  };

  const onCategoryChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setSelectedCategory(option.key as string);
    }
  };

  // Show the success message for 3 seconds when `success` changes
  useEffect(() => {
    if (success) {
      setQuestion(""); // Reset question field after successful submission
      setSelectedCategory(""); // Optional: reset category selection if desired

      const timer = setTimeout(() => {
        resetStatus();
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on unmount or if success changes
    }
  }, [success, resetStatus]);

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <h2 style={{ marginBottom: "0px" }}>Submit your question:</h2>
      <form onSubmit={handleSubmit}>
        <Stack tokens={{ childrenGap: 10 }}>
          <TextField
            label="Question"
            value={question}
            onChange={(e, newValue) => setQuestion(newValue || "")}
            multiline
            rows={4}
            required
          />
          <CategoryDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            label="Select a Category"
            placeholder="Select an option" // Placeholder text specific to SubmitQuestionForm
          />
          <PrimaryButton
            text={loading ? "Submitting..." : "Submit Question"}
            type="submit"
            disabled={loading || question.trim() === ""}
          />
          {error && (
            <MessageBar messageBarType={MessageBarType.error}>
              {error}
            </MessageBar>
          )}
          {success && (
            <MessageBar messageBarType={MessageBarType.success}>
              Question submitted successfully!
            </MessageBar>
          )}
        </Stack>
      </form>
    </Stack>
  );
};

export default SubmitQuestionForm;
