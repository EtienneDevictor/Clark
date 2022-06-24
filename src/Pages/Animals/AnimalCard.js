import React from 'react';

export default function AnimalCard(props) {
  const { index, uniqueKey, id, animal, deleteItem, editItem } = props;
  const styleDiv = {
    width: '40rem',
    padding: '1rem 3rem',
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #D3D3D3',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 'auto'
  };
  return (
    <div key={uniqueKey} style={styleDiv}>
      <div>
        <h1>{animal.title}</h1>
        <p>description: {animal.description}</p>
      </div>
      <div style={{display:'flex', flexDirection: 'column', justifyContent: 'spece-between', postion:'relative', right:'5rem', height: '6rem', width: '4rem'}}>
        <button style={{height: '2rem', backgroundColor: '#ff5252', color: '#fff', border:'none', width: '100%', marginBottom:'0.2rem', borderRadius:'0.3rem'}}
          onClick={() => {
            deleteItem(id);
          }}
        >
          DELETE
        </button>
        <button style={{height: '2rem', backgroundColor: '#6fa8dc', color: '#fff', border:'none', width: '100%', borderRadius:'0.3rem'}}
          onClick={() => {
            editItem(index);
          }}
        >
          EDIT
        </button>
      </div>
    </div>
  );
}
