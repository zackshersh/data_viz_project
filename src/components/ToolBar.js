import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';

import "../styles/toolbar.css"

import globe from "../assets/globe.png"
import scatter from "../assets/scatter.png"

function ToolBar({props}) {


    const [tipDisplay, setTipDisplay] = useState("none");
    const [tipX, setTipX] = useState(0);
    const [tipY, setTipY] = useState(0);

    const options = [
        "Access to electricity (% of total population)",
        "Droughts, floods, extreme temps (% pop. avg. 1990-2009)",
        "GDP ($)",
        "Land area below 5m (% of land area)",
        "Population below 5m (% of total)",
        "Projected annual precipitation change (2045-2065, mm)",
        "Projected annual temperature change (2045-2065, Celsius)"
    ]

    const filterOptions = [
        "Top 10%",
        "Top 25%",
        "All",
        "Bottom 25%",
        "Bottom 10%"
    ]

    const filterOptionValues = [
        0.1,
        0.25,
        1,
        -0.25,
        -0.1
    ]

    const handleModeButton = (e) => {
        props.setMode(e.currentTarget.value);
    }

    const tipHover = (e) => {
        if(tipDisplay == "none") return;
        
        let bounds = e.currentTarget.getBoundingClientRect();
        console.log(bounds);
        // console.log(tipX,tipY)
        setTipX(e.clientX-bounds.left);
        setTipY(e.clientY-bounds.top + 20);
        // setTipX(0);
        // setTipY(0);
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
                        <div className='Select-Container'>
                            <label>Vulnerability Indicator</label>
                            <select className='Parameter-Select' value={props.paramB} onChange={props.handleParamChange}>
                                {options.map((val, i) => {
                                    return <option key={i} value={val}>{val}</option>
                                })}
                            </select>
                        </div>
                        <div className='Select-Container'>
                            <label>Filter</label>
                            <select className='Parameter-Select' value={props.filter} onChange={props.handleFilterChange}>
                                {filterOptions.map((val, i) => {
                                    return <option key={i} value={filterOptionValues[i]}>{val}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className='Fair-Unfair-Container'>
                        <p onMouseEnter={() => setTipDisplay("block")}
                        onMouseLeave={() => setTipDisplay("none")}
                        onMouseMove={tipHover}
                        >"Fair"/Safer<span className='superscript'>*</span></p>
                        <div className='Gradient-Legend'></div>
                        <p>Unfair Risk</p>
                        <div 
                            style={{display: tipDisplay, top: tipY, left: tipX}} className='tooltip Fair-Tooltip'>
                                <p>"Fair"/Safer encompasses both nations who are vulnerable but have contributed to climate change, and nations that contributed to climate change and are not as vulnerable.</p>
                        </div>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
}

export default ToolBar;