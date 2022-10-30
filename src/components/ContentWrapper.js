import React from 'react';

function ContentWrapper({children, small}) {
    return (
        <div className={`Content-Wrapper ${small ? "Content-Wrapper-Small" : ""}`}>
            {children}
        </div>
    );
}

export default ContentWrapper;