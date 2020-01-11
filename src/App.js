import React from 'react';
import './App.css';
import NeoChart from "./neo/NeoChart";

const App = () => (
    <div className="App">
        <h1>Botify Nasa</h1>
        <h4 style={{fontStyle: "italic"}}>(developed by Quang Minh)</h4>
        <div>
            <NeoChart/>
        </div>
    </div>
);

export default App;
