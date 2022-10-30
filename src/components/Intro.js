import React from 'react';
import ContentWrapper from './ContentWrapper';

function Intro(props) {
    return (
        <div className='Intro Container'>
            <ContentWrapper small>
                <h1>The Unfair Reality of Climate Change</h1>
                <h2>A 2009 dataset from the World Bank reveals which countries might be the most affected by climate change after contributing the least.</h2>
                <div className='byline'>
                    <p>By <a href='http://zack-is.online/index.html'>Zack Hersh</a></p>
                    <p>Nov 1, 2022, 12:30pm EDT</p>
                </div>
                <div className='Spacer' style={{padding:"24px 0"}}></div>
                <p className='copy'>In the next decades, the world's nations will, increasingly, have to deal with the effects of climate change. These effects will not be felt equally. Geography and position will mean that rising sea levels, changing weather, increasing temperatures, etc... will unavoidably be more intense for some. Additionally, characteristics such as GDP and access to electricity will mean that some nations will have greater resilience in the face of these effects. </p>
                <p className='copy'>The richest and therefore more resilient nations are also the greatest producers of greenhouse gasses and most responsible for the climate crisis. This leaves many countries that will suffer the most while having contributed the least to climate change. Discover which countries will be treated the most "unfairly" in the climate crisis, by comparing their yearly CO2 emissions with a number of indicators of vulnerability to climate change.</p>


            </ContentWrapper>
        </div>
    );
}

export default Intro;