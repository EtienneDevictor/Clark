import React, { useState } from 'react';
import './Overview.css';
import { Modal } from 'reactstrap';
import InfoCard from '../Profile/admin/AdminView';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
import { formatFirstAndLastName } from '../../APIFunctions/Profile';
const enums = require('../../Enums.js');
const svg = require('./SVG');

export default function OverviewProfile(props) {
  const [toggle, setToggle] = useState(false);
  const [toggleDelete, setToggleDelete] = useState(false);
  const confirmModalProps = {
    headerText: `Delete ${props.user.firstName} ${props.user.lastName} ?`,
    bodyText: `Are you sure you want to delete 
    ${props.user.firstName}? They're kinda cute and
    they'll be gone forever if you do`,
    confirmText: `Yes, ${props.user.firstName} is dead to me`,
    cancelText: 'No, they\'re chill',
    toggle: () => setToggleDelete(!toggleDelete),
    handleConfirmation: () => {
      props.deleteUser(props.user);
      setToggleDelete(!toggleDelete);
    },
    open: toggleDelete
  };

  function mark(bool) {
    return bool ? svg.checkMark() : svg.xMark();
  }
  return (
    <tr className='user-row'>
      <td className='user-row-item'>
        <div className='user-name'>{formatFirstAndLastName(props.user)}</div>
      </td>

      <td className='user-row-item'>{props.user.doorCode}</td>

      <td className='user-row-item'>{props.user.pagesPrinted}/30</td>

      <td className='user-row-item'>{mark(props.user.emailVerified)}</td>

      <td className='user-row-item'>
        {enums.membershipStateToString(props.user.accessLevel)}
      </td>

      <td className='user-row-item'>
        <button
          className='overview-icon'
          onClick={() => {
            setToggleDelete(!toggleDelete);
          }}
        >
          {svg.trashcanSymbol()}
        </button>
      </td>

      <td className='user-row-item'>
        <button
          className='overview-icon'
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          {svg.editSymbol()}
        </button>
      </td>

      <Modal
        isOpen={toggle}
        toggle={() => {
          setToggle(!toggle);
          // props.updateQuery();
        }}
      >
        {svg.cancelEditSymbol(() => {
          // props.updateQuery();
          setToggle(!toggle);
        })}
        <InfoCard updateUserState={props.updateUserState}
          users={props.users} user={props.user}
          token={props.token} />
      </Modal>

      <ConfirmationModal {...confirmModalProps} />
    </tr>
  );
}
