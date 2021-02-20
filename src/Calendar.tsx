import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Table } from 'reactstrap';
import moment, { Moment } from 'moment-timezone';
import { findOneIana } from "windows-iana";
import { Event } from 'microsoft-graph';
import { config } from './Config';
import { getUserWeekCalendar } from './GraphService';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';
import CalendarDayRow from './CalendarDayRow';
import './Calendar.css';

interface CalendarState {
    eventsLoaded: boolean;
    events: Event[];
    startOfWeek: Moment | undefined;
}

class Calendar extends React.Component<AuthComponentProps, CalendarState> {
    constructor(props: any) {
        super(props);
        this.state = {
            eventsLoaded: false,
            events: [],
            startOfWeek: undefined
        };
    }

    async componentDidUpdate() {
        if (this.props.user && !this.state.eventsLoaded) {
            try {
                const accessToken = await this.props.getAccessToken(config.scopes);
                const ianaTimeZone = findOneIana(this.props.user.timeZone);
                const startOfWeek = moment.tz(ianaTimeZone!.valueOf()).startOf('week').utc();
                const events = await getUserWeekCalendar(accessToken, this.props.user.timeZone, startOfWeek);
                this.setState({
                    eventsLoaded: true,
                    events: events,
                    startOfWeek: startOfWeek,
                });
            } catch (err) {
                this.props.setError('ERROR', JSON.stringify(err));
            }
        }
    }

    render() {
        const daysOfWeek = new Array(7).fill(0).map((element, index) => moment(this.state.startOfWeek).add(index, 'day'))
        return (
            <div>
                <div className="mb-3">
                    <h1 className="mb-3">{daysOfWeek[0].format('MMMM D, YYYY')} - {daysOfWeek[daysOfWeek.length - 1].format('MMMM D, YYYY')}</h1>
                    <RouterNavLink to="/newevent" className="btn btn-light btn-sm" exact>New event</RouterNavLink>
                </div>
                <div className="calendar-week">
                    <div className="table-responsive">
                        <Table size="sm">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Event</th>
                                </tr>
                            </thead>
                            <tbody>
                                {daysOfWeek.map(elem =>
                                    <CalendarDayRow
                                        date={elem}
                                        timeFormat={this.props.user.timeFormat}
                                        events={this.state.events.filter(event => moment(event.start?.dateTime).day() === elem.day())} />
                                )}

                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withAuthProvider(Calendar);
