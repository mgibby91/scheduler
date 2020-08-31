import React from 'react';
import "components/InterviewList.scss";
import InterviewListItem from './InterviewListItem'

export default function InterviewList(props) {

  const { interviewers } = props;

  const interviewer = 

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list"></ul>
    </section>
  );

}