import { products } from './data.js';
import { useState } from 'react';
import { getImageUrl } from './utils.js';
import Cart from './App.jsx';

export default function Shop() {
  const [card, setCard] = useState([]);

  function addTocard(product) {
    const productInCard = card.find(item => item.id === product.id);
    if (productInCard) {
      setCard(
        card.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCard([...card, { ...product, quantity: 1 }]);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '70%',
        }}
      >
        <h1>Doll Shop</h1>
        <ul
          style={{
            listStyle: 'none',
            padding: '0',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {products.map(product => (
            <li
              key={product.id}
              style={{
                border: '1px solid #ddd',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <img
                src={getImageUrl(product)}
                alt={product.name}
                style={{ width: '100px', height: '100px' }}
              />
              <h3>{product.name}</h3>
              <p>{product.price} ฿</p>
              <button
                onClick={() => addTocard(product)}
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  cursor: 'pointer',
                }}
              >
                เพิ่มลงตะกร้า
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Cart card={card} setCard={setCard} />
    </div>
  );
}
