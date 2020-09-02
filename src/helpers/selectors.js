

export function getAppointmentsForDay(state, day) {

  if (!state.days.length) return [];

  let filteredAppointments = [];

  for (let dayObj of state.days) {
    if (dayObj.name === day) {
      filteredAppointments.push(dayObj)
    }
  }

  if (!filteredAppointments.length) return [];

  console.log(filteredAppointments);

  const appointments = filteredAppointments[0].appointments.map(appt => {
    return state.appointments[appt];
  });

  return appointments;

}