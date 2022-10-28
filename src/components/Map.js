import React, { useEffect, useState } from 'react';
import ContentWrapper from './ContentWrapper';
import * as d3 from "d3"
import { MapHandler } from '../scripts/mapScripts';
import { rndmFlt } from '../scripts/utils';

import dataProps from "../data/worldbank_climate_props.json"

import "../styles/map.css"

function Map(props) {

    const [mapHandler, setMapHandler] = useState(new MapHandler(".Map-Svg",".Map-Parent")); 

    const [paramA, setParamA] = useState("CO2 emissions per capita (metric tons)");
    const [paramB, setParamB] = useState("Projected annual precipitation change (2045-2065, mm)");

    useEffect(() => {
        mapHandler.init()
    },[]);

    const handleParamChange = (e) => {
        let val = e.target.value;
        console.log(val)
        mapHandler.changeParam(val);
        setParamB(val);
    }


    return (
        <div className='Map Container'>
            <ContentWrapper>
                <div className='Tool-Bar'>
                    <select value={paramB} onChange={handleParamChange}>
                        {dataProps.map((val, i) => {
                            return <option key={i} value={val}>{val}</option>
                        })}
                    </select>
                </div>
                <div className='Map-Parent'>
                    <svg className="Map-Svg" width={720} height={480}>
                        <h1>Hey</h1>
                    </svg>
                </div>
            </ContentWrapper>
        </div>
    );
}

export default Map;