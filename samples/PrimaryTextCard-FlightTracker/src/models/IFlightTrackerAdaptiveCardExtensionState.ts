import { EProcessStatus } from '../constants/EProcessStatus';
import { IntervalTimer } from '../utils/IntervalTimer';
import { IFlightDetailsData } from './IFlightDetailsData';
import { IFlightInformation } from './IFlightInformation';

export interface IFlightTrackerAdaptiveCardExtensionState {
  flightDetails: IFlightInformation;
  processStatus:EProcessStatus;
  error?: string;
  mappedData?: IFlightDetailsData;
  startTimer?: boolean;
  intervalTimer?: IntervalTimer;
}
