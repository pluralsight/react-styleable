import invariant from 'invariant'
import PropTypes from 'prop-types'
import React from 'react'

import getDisplayName from './utils/get-display-name'

const isSpecialKey = selector => selector === 'compose'

function getSelectorsInSetDifference(newCss = {}, origCss = {}) {
  const newSet = Object.keys(newCss)
  const origSet = Object.keys(origCss)
  return newSet
    .filter(selector => origSet.indexOf(selector) === -1)
    .filter(selector => !isSpecialKey(selector))
}

function areSelectorsMatchingSet(newCss, origCss) {
  return getSelectorsInSetDifference(newCss, origCss).length <= 0
}

const rmSpecialCss = css => {
  const { compose, ...rest } = css
  return rest
}

const compose = (toCompose = {}, css) =>
  Object.keys(toCompose).reduce((acc, selector) => {
    acc[selector] = css[selector] + ' ' + toCompose[selector]
    return acc
  }, css)

const validate = (origCss, newCss) => {
  invariant(
    areSelectorsMatchingSet(newCss, origCss),
    'Expected "this.props.css" to provide only selectors in the original stylesheet.  These selectors "%s" are not included in the stylesheet keys, "%s".',
    getSelectorsInSetDifference(newCss, origCss),
    Object.keys(origCss)
  )

  invariant(
    areSelectorsMatchingSet(newCss.compose, origCss),
    'Expected "this.props.css.compose" to provide only selectors in the original stylesheet.  These selectors "%s" are not included in the stylesheet keys, "%s".',
    getSelectorsInSetDifference(newCss.compose, origCss),
    Object.keys(origCss)
  )
}

export default function styleable(origCss) {
  if (!origCss) origCss = {}

  if (typeof origCss !== 'object' || Array.isArray(origCss))
    throw new Error(
      'stylesheet must be an object (ie, export object from a css module)'
    )

  return function decorateSource(DecoratedComponent) {
    class Styleable extends React.Component {
      getCss() {
        const newCss = this.props.css || {}
        validate(origCss, newCss)
        const overridden = { ...origCss, ...rmSpecialCss(newCss) }
        const composed = compose(newCss.compose, overridden)
        return composed
      }
      render() {
        return <DecoratedComponent {...this.props} css={this.getCss()} />
      }
    }
    Styleable.displayName = `Styleable(${getDisplayName(DecoratedComponent)})`
    Styleable.defaultProps = {
      ...DecoratedComponent.defaultProps,
      css: {}
    }
    Styleable.propTypes = {
      ...DecoratedComponent.propTypes,
      css: PropTypes.object
    }
    return Styleable
  }
}
