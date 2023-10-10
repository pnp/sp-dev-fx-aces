export type PresenceStatusMessage = {
    statusMessage: {
        message: {
            content: string;
            contentType: string;
        },
        expiryDateTime: {
            dateTime: string;
            timeZone: string;
        }
    }
}