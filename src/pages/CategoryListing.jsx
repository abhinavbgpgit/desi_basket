import React, { useState, useEffect } from 'react';
import data from '../data/data.json';

const CategoryListing = () => {
  const [vegetables, setVegetables] = useState([]);
  const [fruits, setFruits] = useState([]);

  useEffect(() => {
    const vegetablesList = data.filter(item => item.category === 'vegetable').slice(0, 4);
    const fruitsList = data.filter(item => item.category === 'fruit').slice(0, 4);
    setVegetables(vegetablesList);
    setFruits(fruitsList);
  }, []);

  return (
    <div>
      <h1>Shop by Category</h1>
      <div className="category-listing">
        <div className="category-row">
          <h2>Vegetables</h2>
          <div className="product-grid">
            {vegetables.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          <button>See all</button>
        </div>
        <div className="category-row">
          <h2>Fruits</h2>
          <div className="product-grid">
            {fruits.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          <button>See all</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryListing;