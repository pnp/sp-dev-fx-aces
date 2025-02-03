import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoadingButton from "@mui/lab/LoadingButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useHelpfulCount } from "../../../hooks/useHelpfulCount";
var ListItem = function (_a) {
    var item = _a.item, listName = _a.listName, context = _a.context;
    // Custom hook to handle the helpful count feature
    var _b = useHelpfulCount(context, listName, item.Id, item.HelpfulCount), helpfulCount = _b.helpfulCount, incrementHelpfulCount = _b.incrementHelpfulCount, loading = _b.loading, error = _b.error;
    return (React.createElement(Accordion, { key: item.Id },
        React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null), "aria-controls": "panel-".concat(item.Id, "-content"), id: "panel-".concat(item.Id, "-header") }, item.Title),
        React.createElement(AccordionDetails, null,
            item.Answer,
            "  "),
        React.createElement(AccordionActions, null,
            React.createElement(LoadingButton, { onClick: incrementHelpfulCount, loading: loading, loadingPosition: "start", startIcon: React.createElement(ThumbUpIcon, null), variant: "contained", sx: { textTransform: "none", boxShadow: 'none' }, size: "small" },
                "Helpful ",
                helpfulCount > 0 && "(".concat(helpfulCount, ")"),
                "  "),
            error && React.createElement("p", null, error))));
};
export default ListItem;
//# sourceMappingURL=ListItem.js.map