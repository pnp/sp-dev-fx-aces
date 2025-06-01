import { EScope } from "../../constants/EScope";
import { IHealthServices } from "../../models/IServiceHealthResults";
import { Theme } from "@fluentui/react-components";

export interface IRenderQuickViewProps {
  
  error:Error | undefined;
  theme: Theme | undefined;
  scope: EScope;
  data: IHealthServices[];
}
