import React from 'react';
import style from './Header.module.css';

const Header = ({ getSearch, search, updateSearch }) => {
  return (
    <header>
      <div className={style.logo}>Graceful Recipes</div>
      <ul>
        <li>About</li>
      </ul>
      <form onSubmit={getSearch} className={style['search-form']}>
        <input
          className={style['search-bar']}
          type='text'
          value={search}
          onChange={updateSearch}
        />
        <button className={style['search-button']} type='submit'>
          Search
        </button>
      </form>
    </header>
  );
};

export default Header;
