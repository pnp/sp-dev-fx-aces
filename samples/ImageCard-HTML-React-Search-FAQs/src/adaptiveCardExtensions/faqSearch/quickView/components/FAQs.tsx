import * as React from "react";
import { Pivot, PivotItem, IDropdownOption } from "@fluentui/react";
import SubmitQuestionForm from "./SubmitQuestion/SubmitQuestionsView";
import FAQList from "./FAQ/FAQList";
import MostUsefulList from "./MostUseful/MostUsefulList";
import { ISPFXContext } from "@pnp/sp";
import { getCategories } from "../utlis/getCategories";

export interface IFAQsProps {
  context: ISPFXContext;
  siteUrl: string;
  faqListName: string;
  submitionListName: string;
  faqCollectionData: any;  // Ensure this is a structured array
  faqFilterLabel: string;
}

// Memoize the FAQs component
const FAQs: React.FC<IFAQsProps> = React.memo(({
  context,
  siteUrl,
  faqListName,
  submitionListName,
  faqCollectionData,
  faqFilterLabel
}) => {

  const categories: IDropdownOption[] = React.useMemo(() => {
    return getCategories(faqCollectionData);
  }, [faqCollectionData]);

  return (
    <div style={{ padding: "16px", minWidth: "328px" }}>
      <Pivot>
        <PivotItem headerText="FAQs">
          <FAQList
            context={context}
            siteUrl={siteUrl}
            listName={faqListName}
            categories={categories}
            faqFilterLabel={faqFilterLabel}
          />
        </PivotItem>

        <PivotItem headerText="Most Useful">
          <MostUsefulList
            context={context}
            siteUrl={siteUrl}
            listName={faqListName}
            categories={categories}
            faqFilterLabel={faqFilterLabel}
          />
        </PivotItem>

        <PivotItem headerText="Submit Question">
          <SubmitQuestionForm
            context={context}
            siteUrl={siteUrl}
            listName={submitionListName}
            categories={categories} // Pass categories as prop
          />
        </PivotItem>
      </Pivot>
    </div>
  );
});

export default FAQs;
