import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navigation from './components/Navigation';
import AppRouter from './components/AppRouter';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
        <div className="App">
            <Navigation />
            <div className="page-layout">
                <AppRouter />
            </div>
        </div>
    </BrowserRouter>
  );
}

export default App;
