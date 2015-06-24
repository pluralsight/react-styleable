import assign from 'lodash/object/assign'
import invariant from 'invariant'
import React from 'react'

function getSelectorsNotInStylesheet(cssProps, stylesheet) {
  const propKeys = Object.keys(cssProps)
  const cssKeys = Object.keys(stylesheet)
  return propKeys.filter(prop => !cssKeys.includes(prop))
}

function isPropsAnOverride(cssProps, stylesheet) {
  return getSelectorsNotInStylesheet(cssProps, stylesheet).length <= 0
}

function hasDefinedStyles(stylesheet) {
  return stylesheet && Object.keys(stylesheet).length > 0
}

function stylesAreOverrides(cssProps, stylesheet) {
  return hasDefinedStyles(stylesheet) ? isPropsAnOverride(cssProps, stylesheet) : true
}

export default function styleable(stylesheet) {
  if (!stylesheet)
    stylesheet = {}

  if (typeof stylesheet !== 'object' || Array.isArray(stylesheet))
    throw new Error('stylesheet must be an object (eg, export object from a css module)')

  return function decorateSource(DecoratedComponent) {
    return class CssStyleComponent extends React.Component {
      static defaultProps = {
        css: {}
      }
      static propTypes = {
        css: React.PropTypes.object
      }
      getCss() {
        invariant(
          stylesAreOverrides(this.props.css, stylesheet),
          'Expected "this.props.css" to provide only overrides to the given stylesheet.  Selectors "%s" not included in the stylesheet keys, "%s".',
          getSelectorsNotInStylesheet(this.props.css, stylesheet),
          Object.keys(stylesheet)
        )
        return assign({}, stylesheet, this.props.css)
      }
      render() {
        return <DecoratedComponent ref="wrapped" {...this.props} css={this.getCss()} />
      }
    }
  }
}
