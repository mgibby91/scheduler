import React from "react";
import "components/Button.scss";

const classNames = require('classnames');

export default function Button(props) {
   // let buttonClass = 'button';

   // if (props.confirm) {
   //    buttonClass += ' button--confirm';
   // } else if (props.danger) {
   //    buttonClass += ' button--danger';
   // }

   const buttonClass = classNames('button', { 'button--confirm': props.confirm, 'button--danger': props.danger });

   return (
      <button
         onClick={props.onClick}
         disabled={props.disabled}
         className={buttonClass}
      >
         {props.children}
      </button >
   );
}
