import React, {useState, useEffect} from 'react';
import ContentWrapper from './ContentWrapper';

import "../styles/scatter.css"

function Scatter({}) {

    return (
        <div className='Scatter Container'>
            <ContentWrapper>
                <div className='Scatter-Parent'>
                    <svg className="Scatter-Svg">
                        
                    </svg>
                </div>
            </ContentWrapper>
        </div>
    );
}

export default Scatter;