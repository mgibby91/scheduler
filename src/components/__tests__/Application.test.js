import React from "react";
import axios from 'axios';

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByAltText,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);


describe('Application', () => {

  it("Defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText('Monday'))
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();

  });

  it('Loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, 'Archie Cohen'));

    const appointments = getAllByTestId(container, 'appointment');
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, 'day')
      .find(day => queryByText(day, 'Monday'));

    console.log('day', prettyDOM(day));

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the 'Delete' button on the booked appt.
    const appointment = getAllByTestId(container, 'appointment')
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument();

    // 5. Confirm delete by clicking 'Confirm'
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text 'Deleting' is displayed
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, 'Add'));

    const day = getAllByTestId(container, 'day')
      .find(day => queryByText(day, 'Monday'));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment')
      .find(appointment => queryByText(appointment, 'Archie Cohen'));

    fireEvent.click(queryByAltText(appointment, "Edit"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving')).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, 'day')
      .find(day => queryByText(day, 'Monday'));

    console.log('day', prettyDOM(day));

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });

  it("shows the delete error when failing to delete an existing appointment", () => {
    axios.delete.mockRejectedValueOnce();
  });
})
