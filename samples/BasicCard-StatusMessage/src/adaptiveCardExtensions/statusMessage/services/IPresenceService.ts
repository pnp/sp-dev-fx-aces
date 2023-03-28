import { IPresenceStatus } from "../models/IPresenceStatus";
import { IStatusMessage } from "../models/IStatusMessage";

export interface IPresenceService {
    getCurrentUserStatusMessage(): Promise<IStatusMessage>;
    setCurrentUserStatusMessage(statusMessage: string, expiration: string): Promise<void>;
    getCurrentUserId(): Promise<string>;
    getCurrentSessionId(): Promise<string>;
    setCurrentUserAvailability(userId: string, presence: IPresenceStatus): Promise<void>;
    clearPresence(userId: string, sessionId: string): Promise<void>;
}