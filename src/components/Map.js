import React, { useEffect, useState } from 'react';
import ContentWrapper from './ContentWrapper';
import * as d3 from "d3"
import { MapHandler } from '../scripts/mapScripts';
import { rndmFlt } from '../scripts/utils';

import dataProps from "../data/worldbank_climate_props.json"

import "../styles/map.css"

function Map(props) {




    return (
        <div className='Map Container'>
            <ContentWrapper>
                <div className='Map-Parent'>
                    <svg onWheel={(e) => {console.log("HEY")}} className="Map-Svg">
                        <h1>Hey</h1>
                    </svg>
                </div>
            </ContentWrapper>
        </div>
    );
}

export default Map;