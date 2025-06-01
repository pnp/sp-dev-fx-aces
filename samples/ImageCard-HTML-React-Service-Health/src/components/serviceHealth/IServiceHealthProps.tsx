import { EScope } from "../../constants/EScope";
import { IHealthServices } from "../../models/IServiceHealthResults";

export interface IServiceHealthProps {
 
  onSelected?: (item: IHealthServices | undefined) => void;
  refresh?: number;
  scope: EScope;
  data: IHealthServices[];
  error?: Error | undefined;
}
