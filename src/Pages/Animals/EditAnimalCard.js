import React, { useState } from 'react';

export default function EditAnimalCard(props) {
  const { animal, saveItem } = props;
  const [title, setTitle] = useState(animal.title);
  const [description, setDescription] = useState(animal.description);
  const [lifespan, setLifespan] = useState(animal.lifespan);
  const uniqueKey = animal._id;
  const displayBlock = {
    width: '40rem',
    padding: '1rem 3rem',
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #D3D3D3',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto',
  };
  return (
    <div key={uniqueKey} style={displayBlock}>
      <div style={{ width: '3rem' }}>
        <input
          type='text'
          value={title}
          placeholder={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <input
          type='text'
          value={description}
          placeholder={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <input
          type='text'
          value={lifespan}
          placeholder={lifespan}
          onChange={(e) => {
            setLifespan(e.target.value);
          }}
        />
      </div>

      <button
        style={{
          height: '2rem',
          backgroundColor: '#58BB43',
          color: '#fff',
          border: 'none',
          borderRadius: '0.3rem',
        }}
        onClick={() => {
          saveItem(uniqueKey, title, description, lifespan);
        }}
      >
        SAVE
      </button>
    </div>
  );
}
