export interface IStatusMessage {
    statusMessage: {
        message: {
            content: string;
            contentType: string;
        },
        expiryDateTime: {
            dateTime: string,
            timeZone: string
        }
    }
}