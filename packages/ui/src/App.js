import React, { createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Navigation from './components/Navigation';
import AppRouter from './components/AppRouter';
import AppStore from './App.store';
import './App.scss';

function App() {
  return (
    <AppStore>
        <BrowserRouter>
            <div className="App">
                <Navigation />
                <div className="page-layout">
                    <AppRouter />
                </div>
            </div>
        </BrowserRouter>
    </AppStore>
  );
}

export default App;
