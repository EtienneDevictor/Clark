import React, { useEffect, useState } from 'react';
import {Container} from 'reactstrap'

import Header from '../../Components/Header/Header';
import { getAllAnimals } from '../../APIFunctions/Animals';

export default function AnimalPage() {
  const [animals, setAnimals] = useState([]);

  async function getAnimalsFromDB() {
    const animalsFromDB = await getAllAnimals();
    if (!animalsFromDB.error) {
      setAnimals(animalsFromDB.responseData);
    }
  }

  useEffect(() => {
    getAnimalsFromDB();
  }, []);

  return (
    <div>
      <Header title='Welcome to the Animal Page!!' />
      <Container>
        {animals.map((animal, index) => (
          <div key={index}>
            <h1>{animal.title}</h1>
            <p>description: {animal.description}</p>
          </div>
        ))}
      </Container>
    </div>
  );
}
