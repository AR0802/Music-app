import React from 'react'

import './Error.css'

const error = props => (
    <p className='error'>{props.children}</p>
)

export default error