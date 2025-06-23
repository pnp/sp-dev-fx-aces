import { IConsoleMessageOptions } from "../models/IConsoleMessageOptions";
import { IHealthServices } from "../models/IServiceHealthResults";
import { tokens } from "@fluentui/react-components";

export interface IUtils {
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;

  formatConsoleMessage: (options: IConsoleMessageOptions) => void;
  getHealthStatus: (data: IHealthServices[]) => string;
}

// Status Color token map
const statusColorTokenMap: Record<string, string> = {
  serviceOperational: tokens.colorPaletteGreenBackground3,
  investigating: tokens.colorPaletteYellowBackground3,
  restoringService: tokens.colorPaletteDarkOrangeBackground2,
  verifyingService: tokens.colorPaletteBlueBackground2,
  serviceRestored: tokens.colorPaletteGreenBackground2,
  postIncidentReviewPublished: tokens.colorPaletteBlueBackground2,
  serviceDegradation: tokens.colorPaletteDarkOrangeBackground3,
  serviceInterruption: tokens.colorPaletteRedBackground3,
  extendedRecovery: tokens.colorPalettePurpleBackground2,
  falsePositive: tokens.colorPaletteGreenBackground3,
  investigationSuspended: tokens.colorNeutralBackground5Pressed,
  resolved: tokens.colorPaletteGreenBackground2,
  mitigatedExternal: tokens.colorPaletteBlueBackground2,
  mitigated: tokens.colorPaletteGreenBackground2,
  resolvedExternal: tokens.colorPaletteBlueBackground2,
  confirmed: tokens.colorPaletteYellowBackground3,
  reported: tokens.colorPaletteYellowBackground3,
  unknownFutureValue: tokens.colorNeutralBackground3,
};

// Status Friendly label map
const statusLabelMap: Record<string, string> = {
  serviceOperational: "Operational",
  investigating: "Investigating",
  restoringService: "Restoring Service",
  verifyingService: "Verifying",
  serviceRestored: "Restored",
  postIncidentReviewPublished: "Post-Incident Review",
  serviceDegradation: "Degradation",
  serviceInterruption: "Interruption",
  extendedRecovery: "Extended Recovery",
  falsePositive: "False Positive",
  investigationSuspended: "Investigation Suspended",
  resolved: "Resolved",
  mitigatedExternal: "Mitigated (External)",
  mitigated: "Mitigated",
  resolvedExternal: "Resolved (External)",
  confirmed: "Confirmed",
  reported: "Reported",
  unknownFutureValue: "Unknown Future Value",
};

export const utils = (): IUtils => {
  const getStatusColor = (status: string): string => {
    const key = status;
    return statusColorTokenMap[key] ?? tokens.colorNeutralBackground3;
  };

  const getStatusLabel = (status: string): string => {
    const key = status;
    return statusLabelMap[key] ?? "Unknown";
  };

  const formatConsoleMessage = ({
    appName,
    functionName,
    messageType,
    message,
  }: IConsoleMessageOptions): void => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${appName}] [${functionName}] ${message}`;

    switch (messageType) {
      case "info":
        console.info(formattedMessage);
        break;
      case "warn":
        console.warn(formattedMessage);
        break;
      case "error":
        console.error(formattedMessage);
        break;
      case "log":
      default:
        console.log(formattedMessage);
        break;
    }
  };

  const getHealthStatus = (data: IHealthServices[]): string => {
    let healthStatus = "🟢 All services are operational.";
    for (const item of data) {
      const status = item.status;
      if (status === "serviceInterruption" || status === "serviceDegradation") {
        return "🔴 Some services are degraded";
      } else if (status !== "serviceOperational") {
        healthStatus = "🟡 Some services are having restrictions.";
      }
    }
    return healthStatus;
  };

  return {
    getStatusColor,
    getStatusLabel,
    formatConsoleMessage,
    getHealthStatus,
  };
};
