import { IHealthServices } from "../../models/IServiceHealthResults";
import { Theme } from "@fluentui/react-components";

export interface IIssueDetailsProps {
  selectedItem: IHealthServices;
  onDismiss: () => void;
  isOpen: boolean;
  theme: Theme
}
