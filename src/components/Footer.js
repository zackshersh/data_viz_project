import React from 'react';
import ContentWrapper from './ContentWrapper';

import "../styles/footer.css"

function Footer({}) {
    return (
        <div className='Footer Container'>
            <ContentWrapper>
                <p>Data from The World Bank's <a href='https://datacatalog.worldbank.org/search/dataset/0040205'>Climate Change Dataset</a></p>
                <p>Supporting information and conceptual basis from <a href='https://doi.org/10.1002/wcc.275'><i>From environmental to climate justice: climate change and the discoure of environmental justice (2014)</i></a>, by David Schlosberg and Lisette B. Collins </p>
            </ContentWrapper>
        </div>
    );
}

export default Footer;