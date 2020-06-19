import React from 'react';
import style from './Recipes.module.css';

const Recipes = ({ renderSearch, renderBody }) => {
  return (
    <div>
      <div>{renderSearch()}</div>
      <div className={style.recipes}>{renderBody()}</div>
    </div>
  );
};

export default Recipes;
