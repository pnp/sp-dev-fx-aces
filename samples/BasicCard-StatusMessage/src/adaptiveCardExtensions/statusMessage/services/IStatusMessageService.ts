import { IStatusMessage } from "../models/IStatusMessage";

export interface IStatusMessageService {
    getCurrentUserStatusMessage(): Promise<IStatusMessage>;
    setCurrentUserStatusMessage(statusMessage: string): Promise<void>;
    getCurrentUserId(): Promise<string>;
    setCurrentUserAvailability(userId: string, sessionId: string, availability: string, activity: string): Promise<void>;
    getCurrentSessionId(): Promise<string>;
}