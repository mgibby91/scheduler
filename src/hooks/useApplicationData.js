import { useEffect, useState } from 'react';
import { updateSpotsRemaining } from '../helpers/selectors';

import axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day })

  useEffect(() => {

    const promiseDays = axios.get('/api/days');
    const promiseAppointments = axios.get('/api/appointments');
    const promiseInterviewers = axios.get('/api/interviewers');

    Promise.all([promiseDays, promiseAppointments, promiseInterviewers]).then((all) => {
      let [days, appointments, interviewers] = all;

      days = days.data;
      appointments = appointments.data;
      interviewers = interviewers.data;

      setState(prev => ({ ...prev, days, appointments, interviewers }));
    })
  }, []);


  const bookInterview = (id, interview) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {

        const days = updateSpotsRemaining(state, appointments);

        setState({
          ...state,
          appointments,
          days
        })
      })
  }


  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {

        const days = updateSpotsRemaining(state, appointments);

        setState({
          ...state,
          appointments,
          days
        });

      })

  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }

}