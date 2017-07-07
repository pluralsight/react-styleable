import getDisplayName from './utils/get-display-name'
import invariant from 'invariant'
import React from 'react'
import PropTypes from 'prop-types'

const isSpecialKey = selector => selector === 'compose'

function getSelectorsNotInStylesheet(cssProps = {}, stylesheet) {
  const propKeys = Object.keys(cssProps)
  const cssKeys = Object.keys(stylesheet)
  return propKeys
    .filter(prop => cssKeys.indexOf(prop) === -1)
    .filter(k => !isSpecialKey(k))
}

function isPropsAnOverride(cssProps, stylesheet) {
  return getSelectorsNotInStylesheet(cssProps, stylesheet).length <= 0
}

function hasDefinedStyles(stylesheet) {
  return stylesheet && Object.keys(stylesheet).length > 0
}

function stylesAreOverrides(cssProps, stylesheet) {
  return hasDefinedStyles(stylesheet)
    ? isPropsAnOverride(cssProps, stylesheet)
    : true
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

export default function styleable(stylesheet) {
  if (!stylesheet) stylesheet = {}

  if (typeof stylesheet !== 'object' || Array.isArray(stylesheet))
    throw new Error(
      'stylesheet must be an object (ie, export object from a css module)'
    )

  return function decorateSource(DecoratedComponent) {
    class Styleable extends React.Component {
      getCss() {
        invariant(
          stylesAreOverrides(this.props.css, stylesheet),
          'Expected "this.props.css" to provide only overrides to the given stylesheet.  Selectors "%s" not included in the stylesheet keys, "%s".',
          getSelectorsNotInStylesheet(this.props.css, stylesheet),
          Object.keys(stylesheet)
        )

        invariant(
          stylesAreOverrides((this.props.css || {}).compose, stylesheet),
          'Expected "this.props.css" to provide only composes to the given stylesheet.  Selectors "%s" not included in the stylesheet keys, "%s".',
          getSelectorsNotInStylesheet(
            (this.props.css || {}).compose,
            stylesheet
          ),
          Object.keys(stylesheet)
        )

        const overridden = { ...stylesheet, ...rmSpecialCss(this.props.css) }
        const composed = compose((this.props.css || {}).compose, overridden)
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
