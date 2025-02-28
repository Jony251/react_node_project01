import React from 'react';
import './Age.css';

const Age = ({ ageRating }) => {
  return (
    <div className="age-balloon">
      <span className="age-text">{'+'+ageRating || '12+'}</span>
    </div>
  );
};

export default Age;