import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.scss';

const Navigation = () => {
    return (
        <header className="app-header">
            <div className="links">
                <NavLink to="/logs">Logs</NavLink>
                <NavLink to="/pipeline">Pipeline</NavLink>
            </div>
        </header>
    )
}

export default Navigation
