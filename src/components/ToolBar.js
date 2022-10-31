import React from 'react';
import ContentWrapper from './ContentWrapper';

import "../styles/toolbar.css"

import globe from "../assets/globe.png"
import scatter from "../assets/scatter.png"

function ToolBar({props}) {

    const options = [
        "Access to electricity (% of total population)",
        "Droughts, floods, extreme temps (% pop. avg. 1990-2009)",
        "GDP ($)",
        "Land area below 5m (% of land area)",
        "Population below 5m (% of total)",
        "Projected annual precipitation change (2045-2065, mm)",
        "Projected annual temperature change (2045-2065, Celsius)"
    ]

    const handleModeButton = (e) => {
        props.setMode(e.currentTarget.value);
    }

    return (
        <div className='Tool-Bar Container'>
            <ContentWrapper>
                <div>
                    <div className='ModeButtons-and-Params'>
                        <div className='Mode-Buttons'>
                            <button className={` ${props.mode == "map" ? "active" : ""}`} value="map" onMouseDown={handleModeButton}><img src={globe}></img></button>
                            <button className={` ${props.mode == "scatter" ? "active" : ""}`} value="scatter" onMouseDown={handleModeButton}><img src={scatter}></img></button>
                        </div>
                        <select className='Parameter-Select' value={props.paramB} onChange={props.handleParamChange}>
                            {options.map((val, i) => {
                                return <option key={i} value={val}>{val}</option>
                            })}
                        </select>
                    </div>
                    <div className='Fair-Unfair-Container'>
                        <p>"Fair"</p>
                        <div className='Gradient-Legend'></div>
                        <p>Unfair</p>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
}

export default ToolBar;