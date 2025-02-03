import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { ISPFXContext } from "@pnp/sp";
import { useHelpfulCount } from "../../../hooks/useHelpfulCount";

// Define the properties expected by the ListItem component
export interface IListItemProps {
  item: {
    Id: number;          
    Title: string;        
    Answer: string;        
    HelpfulCount: number;
  };
  listName: string;        
  context: ISPFXContext;   
}

const ListItem: React.FC<IListItemProps> = ({ item, listName, context }) => {
  // Custom hook to handle the helpful count feature
  const { helpfulCount, incrementHelpfulCount, loading, error } = useHelpfulCount(
    context,            
    listName,           
    item.Id,            
    item.HelpfulCount   
  );

  return (
    <Accordion key={item.Id}>
      {/* Accordion header with expandable feature */}
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}                     
        aria-controls={`panel-${item.Id}-content`}          
        id={`panel-${item.Id}-header`}                    
      >
        {/* Display the title of the question */}
        {item.Title}
      </AccordionSummary>

      {/* Accordion body with the answer */}
      <AccordionDetails>
        {item.Answer}  {/* Display the answer to the question */}
      </AccordionDetails>

      {/* Accordion footer with actions (Helpful button) */}
      <AccordionActions>
        {/* Button for users to mark the question as helpful */}
        <LoadingButton
          onClick={incrementHelpfulCount}    
          loading={loading}                   
          loadingPosition="start"             
          startIcon={<ThumbUpIcon />}        
          variant="contained"                
          sx={{ textTransform: "none", boxShadow: 'none' }}  
          size="small"                     
        >
          Helpful {helpfulCount > 0 && `(${helpfulCount})`}  {/* Display the helpful count if it's greater than 0 */}
        </LoadingButton>

        {/* If there's an error updating the helpful count, show the error */}
        {error && <p>{error}</p>}
      </AccordionActions>
    </Accordion>
  );
};

export default ListItem;
