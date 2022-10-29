import React from 'react';
import ContentWrapper from './ContentWrapper';

function ToolBar({props}) {

    console.log(props)
    return (
        <div className='Tool-Bar'>
            <ContentWrapper>
                <div className='Tool-Bar'>
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