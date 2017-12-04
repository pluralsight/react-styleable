import React from 'react'
import { render } from 'react-dom'

import styleable from '../../src/styleable'

import css from './index.css'
import overrideCss from './override.css'

const Comp = props => (
  <h1 className={props.css.heading}>
    Originally red, overridden to blue in React v
    {React.version}
  </h1>
)

const StyledComp = styleable(css)(Comp)

render(<StyledComp css={overrideCss} />, document.getElementById('app'))
