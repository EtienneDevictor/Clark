import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let ANIMAL_API_URL = 'http://localhost:8084/animal_api';

export async function getAllAnimals() {
  let status = new ApiResponse();
  await axios
    .get(ANIMAL_API_URL + '/Animal/getAnimals')
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createAnimal(newAnimal, token) {
  let status = new ApiResponse();
  await axios
    .post(ANIMAL_API_URL + '/Animal/createAnimal', { ...newAnimal, token })
    .catch((err) => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}

export async function deleteAnimal(id){
  let status = new ApiResponse();
  await axios
  .post(ANIMAL_API_URL + '/Animal/deleteAnimal', {_id: id})
  .catch((err) => {
    status.error = true;
    status.responseData = err;

  });
}

export async function editAnimal(editAnimal){
  let status = new ApiResponse();
  await axios
  .post(ANIMAL_API_URL + '/Animal/editAnimal', {...editAnimal})
  .catch(err=>{
    status.error = true;
    status.responseData = err;
  });
}
