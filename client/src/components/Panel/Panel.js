import React from 'react'

import './Panel.css'

const panel = props => (
    <div className='panel'>
        {props.children}
    </div>
)

export default panel