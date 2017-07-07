import getDisplayName from './utils/get-display-name'
import invariant from 'invariant'
import React from 'react'
import PropTypes from 'prop-types'

function getSelectorsNotInStylesheet(cssProps, stylesheet) {
  const propKeys = Object.keys(cssProps)
  const cssKeys = Object.keys(stylesheet)
  return propKeys.filter(prop => cssKeys.indexOf(prop) === -1)
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
        return { ...stylesheet, ...this.props.css }
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
