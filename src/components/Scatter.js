import React, {useState, useEffect} from 'react';
import ContentWrapper from './ContentWrapper';

function Scatter({}) {



    return (
        <div className='Scatter Container'>
            <ContentWrapper>
                <div className='Scatter-Parent'>
                    <svg className="Scatter-Svg" width={1024} height={480}>
                        
                    </svg>
                </div>
            </ContentWrapper>
        </div>
    );
}

export default Scatter;