import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Recipes from './components/Recipes';
import Recipe from './components/Recipe';
import About from './components/About';
import Header from './components/Header';
import './App.css';

const App = () => {
  const APP_ID = '61085f7e';
  const APP_KEY = 'e3238ca787f9507ef2159b0bf62ac8fc';

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('kimchi');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecipes();
  }, [query]);

  const getRecipes = async () => {
    const response = await fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
    );
    const data = await response.json();

    setRecipes(data.hits);
    setLoading(true);
    if (data.hits.length === 0) {
      setLoading(false);
    }
  };

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  // Search only gets updated when the query is set/ button is clicked
  const getSearch = (e) => {
    e.preventDefault();
    if (search.trim() === '') {
      return;
    }

    setLoading(true);
    setQuery(search);
    // Clear the input field
    setSearch('');
  };

  const renderSearch = () => {
    if (recipes.length === 0 && !loading) {
      return (
        <h1 className='errorMessage'>
          There is no result of {query}. Please try again.
        </h1>
      );
    } else {
      return <h1 className='search-result'>Search Result: {query}</h1>;
    }
  };

  const renderBody = () => {
    return recipes.map((recipe) => (
      <Recipe
        key={recipe.recipe.label}
        title={recipe.recipe.label}
        calories={recipe.recipe.calories}
        image={recipe.recipe.image}
        ingredients={recipe.recipe.ingredients}
        tags={recipe.recipe.healthLabels}
      />
    ));
  };

  return (
    <div>
      <Header
        getSearch={getSearch}
        search={search}
        updateSearch={updateSearch}
      />
      <main>
        <Recipes renderSearch={renderSearch} renderBody={renderBody} />
      </main>
    </div>
  );
};

export default App;
