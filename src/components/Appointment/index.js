import React from 'react';
import './styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import { useVisualMode } from '../../hooks/useVisualMode';
import Status from './Status';
import Confirm from './Confirm';

export default function Appointment(props) {

  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    }

    transition(SAVING);

    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    })
  }

  const deleteInterview = () => {
    transition(DELETING);

    props.cancelInterview(props.id).then(() => {
      transition(EMPTY);
    });

  }

  const confirmDelete = () => {
    transition(CONFIRM);
  }

  const editInterview = () => {
    transition(CREATE);
  }


  return (
    <article className='appointment'>
      <Header
        time={props.time}
      />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
          onEdit={editInterview}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
          name={props.interview ? props.interview.student : ''}
          interviewer={props.interview ? props.interview.interviewer.id : null}
        />
      )}
      {mode === SAVING && (
        <Status message={'Saving'} />
      )}
      {mode === DELETING && (
        <Status message={'Deleting'} />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={'Are you sure you would like to delete?'}
          onConfirm={deleteInterview}
          onCancel={() => back()}
        />
      )}
    </article>
  );


}
