import React from 'react';
import style from './Recipe.module.css';

const Recipe = ({ title, calories, image, ingredients, tags }) => {
  return (
    <div className={style.recipe}>
      <img src={image} alt='' />
      <h1 className={style.title}>{title}</h1>
      <p>{Math.round(calories)}kcal</p>
      <p>Ingredients</p>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient.text}</li>
        ))}
      </ul>
      <p>
        Tags:{' '}
        {tags.map((tag, index) => (
          <span key={index} className={style.tag}>
            {tag}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Recipe;
