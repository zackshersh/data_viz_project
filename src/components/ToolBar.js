import React from 'react';
import ContentWrapper from './ContentWrapper';

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

    return (
        <div className='Tool-Bar Container'>
            <ContentWrapper>
                <div>
                    <select value={props.paramB} onChange={props.handleParamChange}>
                        {props.dataProps.map((val, i) => {
                            return <option key={i} value={val}>{val}</option>
                        })}
                    </select>
                </div>
            </ContentWrapper>
        </div>
    );
}

export default ToolBar;