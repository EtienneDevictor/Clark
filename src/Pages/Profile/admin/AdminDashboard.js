import React from 'react';
import './AdminDashboard.css';
import InfoCard from '../MemberView/InfoCard';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const fields = [
    { title: 'User Manager', url: '/user-manager'},
    { title: 'Event Manager', url: '/event-manager'},
    { title: 'LED Sign', url: '/led-sign'},
    { title: '3D Console', url: '/3dconsole'},
    { title: 'Email Blast', url: '/email-list'}
  ];

  return (
    <div className='admin-dashboard-bg'>
      <h1 id='admin-dashboard-header'>Admin Dashboard</h1>
      <div className='flexbox-container'>
      {fields.map((elem, ind) => {
        return (
          <Link to={elem.url} key={ind} id='admin-box'>
            <InfoCard
              key={ind}
              field={elem}
            />
          </Link>
        );
      })}
      </div>
    </div>
  );
}

export default AdminDashboard;