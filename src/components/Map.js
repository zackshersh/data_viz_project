import React, { useEffect, useState } from 'react';
import ContentWrapper from './ContentWrapper';
import * as d3 from "d3"
import { MapHandler } from '../scripts/mapScripts';

function Map(props) {

    const [mapHandler, setMapHandler] = useState(new MapHandler(".Map-Svg")); 

    useEffect(() => {
        mapHandler.init()
    },[]);

    return (
        <div className='Map Container'>
            <ContentWrapper>
                <svg className="Map-Svg" width={720} height={480}></svg>
            </ContentWrapper>
        </div>
    );
}

export default Map;