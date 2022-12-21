import { IStatusMessage } from "../models/IStatusMessage";

export interface IStatusMessageService {
    getCurrentUserStatusMessage(): Promise<IStatusMessage>;
    setCurrentUserStatusMessage(statusMessage: string): Promise<void>;
}