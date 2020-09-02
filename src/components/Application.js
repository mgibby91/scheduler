import React, { useState, useEffect } from "react";
import DayList from 'components/DayList';
import "components/Application.scss";
import Appointment from 'components/Appointment/index'
import getAppointmentsForDay from '../helpers/selectors';

const axios = require('axios');

// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2,
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5,
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0,
//   },
// ];

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//     interview: {
//       student: "Mike Tyson",
//       interviewer: {
//         id: 2,
//         name: "Tori Malcom",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//   },
//   {
//     id: 4,
//     time: "4pm",
//     interview: {
//       student: "Tiger Woods",
//       interviewer: {
//         id: 2,
//         name: "Tori Malcom",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "5pm",
//   },
// ];

export default function Application(props) {

  // const [days, setDays] = useState([]);
  // const [day, setDay] = useState('Monday')
  // const [appointments, setAppointments] = useState({});

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day })
  // const setDays = days => setState(prev => ({ ...prev, days }));

  useEffect(() => {

    const urlDays = '/api/days';
    const urlAppointments = '/api/appointments';

    const promiseDays = axios.get(urlDays);
    const promiseAppointments = axios.get(urlAppointments);

    Promise.all([promiseDays, promiseAppointments]).then((all) => {
      let [days, appointments] = all;

      days = days.data;
      appointments = appointments.data;

      console.log('appointments', appointments);
      console.log('days', days);

      setState(prev => ({ ...prev, days, appointments }));
    })
  }, []);

  const apptArray = getAppointmentsForDay(state, state.day);
  const appointmentData = apptArray.map(appointment => {
    return <Appointment key={appointment.id} {...appointment} />
  });


  return (
    <main className="layout">
      {
        <section className="sidebar">
          <img
            className="sidebar--centered"
            src="images/logo.png"
            alt="Interview Scheduler"
          />
          <hr className="sidebar__separator sidebar--centered" />
          <nav className="sidebar__menu">
            <DayList
              days={state.days}
              day={state.day}
              setDay={setDay}
            />
          </nav>
          <img
            className="sidebar__lhl sidebar--centered"
            src="images/lhl.png"
            alt="Lighthouse Labs"
          />
        </section>
      }
      {
        <section className="schedule">
          {appointmentData}
          <Appointment key="last" time="6pm" />
        </section>
      }
    </main>
  );
}
