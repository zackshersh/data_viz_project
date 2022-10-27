import React, { useEffect, useState } from 'react';
import ContentWrapper from './ContentWrapper';
import * as d3 from "d3"
import { MapHandler } from '../scripts/mapScripts';
import { rndmFlt } from '../scripts/utils';

function Map(props) {

    const [mapHandler, setMapHandler] = useState(new MapHandler(".Map-Svg")); 

    useEffect(() => {
        mapHandler.init()
    },[]);

    return (
        <div className='Map Container'>
            <ContentWrapper>
                <svg onMouseDown={() => {mapHandler.generateMap(rndmFlt(10))}} className="Map-Svg" width={720} height={480}></svg>
            </ContentWrapper>
        </div>
    );
}

export default Map;