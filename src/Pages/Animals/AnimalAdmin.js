import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import AnimalCard from './AnimalCard';
import EditAnimalCard from './EditAnimalCard';
import {
  getAllAnimals,
  createAnimal,
  deleteAnimal,
  editAnimal,
} from '../../APIFunctions/Animals';
import { Container, Col, Row, Input, Button } from 'reactstrap';

export default function AnimalAdmin(props) {
  const [animals, setAnimals] = useState([]);

  const [description, setDescription] = useState();
  const [title, setTitle] = useState();
  const [lifespan, setLifespan] = useState();

  const [editIndex, setEditIndex] = useState(-1);

  const [isSaved, setIsSaved] = useState(false)

  async function getAnimalsFromDB() {
    const animalsFromDB = await getAllAnimals();
    if (!animalsFromDB.error) {
      setAnimals(animalsFromDB.responseData);
    }
  }

  useEffect(() => {
    getAnimalsFromDB();
  }, [animals]);

  function deleteItem(id) {
    deleteAnimal(id);
  }

  function editItem(chosenIndex) {
    setEditIndex(chosenIndex);
    setIsSaved(false)
  }

  function saveItem(newId, newTitle, newDescription, newLifespan){
    const editedAnimal = {
      title: newTitle,
      description: newDescription,
      lifespan: newLifespan,
      _id: newId,
    }
    editAnimal(editedAnimal);
    setIsSaved(true)
  }

  return (
    <div>
      <Header title='Welcome to the Animal Admin Page!!' />
      <Container>
        <Row className='container' style={{ padding: '2em' }}>
          <Col>
            <Input
              placeholder='Title'
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
          <Col>
            <Input
              placeholder='Description'
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
          <Col>
            <Input
              placeholder='Lifespan'
              onChange={(e) => setLifespan(e.target.value)}
            />
          </Col>
          <Col>
            <Button
              disabled={!title}
              onClick={() =>
                createAnimal(
                  {
                    title,
                    description,
                    lifespan,
                  },
                  props.user.token
                )
              }
              style={{ width: '10rem' }}
            >
              Submit
            </Button>
          </Col>
        </Row>
        {animals.length === 0 ? (
          <h1>There is no animal!</h1>
        ) : (
          animals.map( (animal, index) =>
            index === editIndex ? (
              !isSaved ?
              <EditAnimalCard key={animal._id} animal={animal} saveItem={saveItem}/> :
              <AnimalCard
                index={index}
                key={animal._id}
                id={animal._id}
                animal={animal}
                deleteItem={deleteItem}
                editItem={editItem}
              />
            ) : (
              <AnimalCard
                index={index}
                key={animal._id}
                id={animal._id}
                animal={animal}
                deleteItem={deleteItem}
                editItem={editItem}
              />
            )
          )
        )}
      </Container>
    </div>
  );
}
