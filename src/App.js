import React from 'react';
import './App.css';
import posterNasa from './image/poster_nasa.jpg'; // Tell Webpack this JS file uses this image
import NeoDisplay from "./neo/NeoDisplay";

const App = () => (
    <div className="App">
        <h2>Botify Nasa</h2>
        <h5 style={{fontStyle: "italic"}}>(developed by Quang Minh)</h5>
        <img alt="posterNasa" src={posterNasa} style={{maxWidth: "150px"}}/>
        <div>
            <NeoDisplay/>
        </div>
    </div>
);

export default App;
