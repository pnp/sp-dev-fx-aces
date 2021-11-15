import { graph } from "@pnp/graph";
import '@pnp/graph/calendars';
import '@pnp/graph/users';
import { add, format } from 'date-fns';
import { IEvent } from "../models/IEvent";


export class PnPService {
    public async _init(days: number): Promise<IEvent[]> {
        let eventsArray: IEvent[] = [];
        const today = new Date();
        const futureDate = add(new Date(), {
            days: days
        });
        console.log(futureDate);
        
        const events = await graph.me.calendarView(today.toISOString(), futureDate.toISOString()).orderBy('Start/DateTime', true).get()
        events.map(event => {
            eventsArray.push(
                {
                    startTime: format(new Date(event.start.dateTime),'MM/dd/yy hh:mm'),
                    endTime: format(new Date(event.end.dateTime),'MM/dd/yy hh:mm'),
                    subject: event.subject,
                    url: event.webLink
                }
            );
        });
        return eventsArray;
    }
}
