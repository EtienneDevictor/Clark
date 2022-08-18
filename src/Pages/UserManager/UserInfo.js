import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserById } from '../../APIFunctions/User';
import Header from '../../Components/Header/Header';

export default function UserInfo(props) {
  console.log(props);
  const ID = '62db7a8d94dea2d7728a041d';
  const [chosenUser, setChosenUser] = useState([]);
  const [isFinishedFetching, setIsFinishedFetching] = useState(false);

  useEffect( () => {
    async function getUser() {
      const user = await getUserById(ID);
      setChosenUser(user.responseData);
      setIsFinishedFetching(true);
    }
    getUser();
  }, []);

  return (
    <div>
      <Header title='User Information' />
      {isFinishedFetching && (
        <div>
          <p>{chosenUser.firstName}</p>
          <p>{chosenUser.lastName}</p>
          <p>{chosenUser.password}</p>
          <p>{chosenUser.doorcode}</p>
        </div>
      )}
    </div>
  );
}
