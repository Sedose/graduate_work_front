import moment, { Moment } from 'moment';
import { Event } from 'microsoft-graph';
import { PageCollection, PageIterator } from '@microsoft/microsoft-graph-client';
const graph = require('@microsoft/microsoft-graph-client');

const getAuthenticatedClient = (accessToken: string) => graph.Client.init({
  authProvider: (done: any) => {
    done(null, accessToken);
  },
});

export const getUserDetails = async (accessToken: string) => await getAuthenticatedClient(accessToken)
  .api('/me')
  .select('displayName,mail,mailboxSettings,userPrincipalName')
  .get();

export const getUserWeekCalendar = async (accessToken: string, timeZone: string, startDate: Moment): Promise<Event[]> => {
  const client = getAuthenticatedClient(accessToken);
  const startDateTime = startDate.format();
  const endDateTime = moment(startDate).add(7, 'day').format();

  const response: PageCollection = await client
    .api('/me/calendarview')
    .header('Prefer', `outlook.timezone="${timeZone}"`)
    .query({ startDateTime, endDateTime })
    .select('subject,organizer,start,end,attendees')
    .orderby('start/dateTime')
    .top(50)
    .get();

  if (response['@odata.nextLink']) {
    const events: Event[] = [];
    const pageIterator = new PageIterator(client, response, (event) => {
      events.push(event);
      return true;
    });
    await pageIterator.iterate();
    return events;
  }
  return response.value;
};

export const createEvent = async (accessToken: string, newEvent: Event): Promise<Event> => await getAuthenticatedClient(accessToken)
  .api('/me/events')
  .post(newEvent);
