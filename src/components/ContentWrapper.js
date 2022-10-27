import React from 'react';

function ContentWrapper({children}) {
    return (
        <div className='Content-Wrapper'>
            {children}
        </div>
    );
}

export default ContentWrapper;