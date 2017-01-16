import React from 'react';
import {
  Match,
  Miss,
} from 'react-router';

import Home from './Home';
import Post from './Post';
import Profile from './Profile';
import Error404 from './Error404';
import Header from '../components/Header';

function Pages() {
  return (
    <main role="application">

      <Header />

      {/* List Articles */}
      <Match
        pattern="/"
        exactly
        component={Home}
      />

      {/* Article details */}
      <Match
        pattern="/post/:id"
        exactly
        component={Post}
      />

      {/* User profile */}
      <Match
        pattern="/user/:id"
        exactly
        component={Profile}
      />

      {/* Error 404 */}
      <Miss
        component={Error404}
      />
    </main>
  );
}

export default Pages;
