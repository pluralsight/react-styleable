import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils'
import PropTypes from 'prop-types'

import styleable from '../styleable'

const css = {
  content: 'someHashFromALocalCssModule'
}

function mkFixture(css) {
  class Subject extends React.Component {
    render() {
      return (
        <div className={this.props.css.content} ref="content">
          Content {this.props.aDefault}
        </div>
      )
    }
  }

  Subject.defaultProps = {
    aDefault: 'still here'
  }

  return styleable(css)(Subject)
}

function mkFixtureWithReqPropTypes() {
  class Subject extends React.Component {
    render() {
      return (
        <div className={this.props.css.content} ref="content">
          Req content {this.props.aReqProp}
        </div>
      )
    }
  }

  Subject.propTypes = {
    aReqProp: PropTypes.string.isRequired
  }

  return styleable(css)(Subject)
}

function mkFunctionFixture(css) {
  function subject(props) {
    return (
      <div className={props.css.content}>
        Content {props.aDefault}
      </div>
    )
  }
  subject.defaultProps = {
    aDefault: 'still here'
  }

  return styleable(css)(subject)
}

function mkFunctionFixtureWithReqPropTypes() {
  function subject(props) {
    return (
      <div className={props.css.content}>
        Req content {props.aReqProp}
      </div>
    )
  }
  subject.propTypes = {
    aReqProp: PropTypes.string.isRequired
  }

  return styleable(css)(subject)
}

describe('styleable', () => {
  it('creates a default stylesheet if none supplied', () => {
    const defaultStylesheet = {}
    const Subject = mkFixture()
    const component = TestUtils.renderIntoDocument(<Subject />)
    component.props.css.should.eql(defaultStylesheet)
  })

  describe('with invalid stylesheet', () => {
    it('rejects css as strings', () => {
      ;(() => {
        const Subject = mkFixture('nonCssObj')
        TestUtils.renderIntoDocument(<Subject />)
      }).should.throw(/must be an object/)
    })

    it('rejects css as array', () => {
      ;(() => {
        const Subject = mkFixture(['css', 'stuff'])
        TestUtils.renderIntoDocument(<Subject />)
      }).should.throw(/must be an object/)
    })
  })

  it('wraps the component in a component', () => {
    const Subject = mkFixture()
    const component = TestUtils.renderIntoDocument(<Subject />)
    component.refs.should.not.have.property('content')
  })

  describe('with invalid selectors (superset)', () => {
    it('rejects override styles that wont be used', done => {
      const origCss = { content: 'hash' }
      const overrideCss = { unusedSelector: 'anotherHash' }
      const Subject = mkFixture(origCss)
      try {
        TestUtils.renderIntoDocument(<Subject css={overrideCss} />)
      } catch (e) {
        /*
          Using this instead of (() => {}).should.throw()
          Because I was getting this error:
           TypeError: Cannot call a class as a function
             at _classCallCheck (lib/styleable.js:23:34)
             at CssStyleComponent (lib/styleable.js:31:35)
             at Context.<anonymous> (lib/__specs__/styleable.spec.js:64:41)
         */
        e.message.should.match(/provide only selectors/)
        done()
      }
    })

    it('rejects compose styles that wont be used', done => {
      const origCss = { content: 'hash' }
      const overrideCss = { compose: { unusedSelector: 'anotherHash' } }
      const Subject = mkFixture(origCss)
      try {
        TestUtils.renderIntoDocument(<Subject css={overrideCss} />)
      } catch (e) {
        e.message.should.match(/provide only selectors/)
        done()
      }
    })
  })

  it('overrides original stylesheet', () => {
    const newHash = 'anotherHash'
    const origCss = { content: 'hash' }
    const overrideCss = { content: newHash }
    const Subject = mkFixture(origCss)
    var component = TestUtils.renderIntoDocument(<Subject css={overrideCss} />)
    ReactDOM.findDOMNode(component).className.should.eql(newHash)
  })

  it('composes new css', () => {
    const origCss = { content: 'hash' }
    const overrideCss = { compose: { content: 'anotherHash' } }
    const Subject = mkFixture(origCss)
    var component = TestUtils.renderIntoDocument(<Subject css={overrideCss} />)
    ReactDOM.findDOMNode(component).className.should.eql('hash anotherHash')
  })

  it('lets defaultProps pass through', () => {
    const Subject = mkFixture()
    Subject.defaultProps.aDefault.should.exist
    const component = TestUtils.renderIntoDocument(<Subject />)
    component.props.aDefault.should.eql('still here')
  })

  it('lets propTypes pass through', () => {
    const Subject = mkFixtureWithReqPropTypes()
    Subject.propTypes.aReqProp.should.exist
  })

  describe('with stateless functions', () => {
    it('makes the css prop available', () => {
      const css = { content: 'cssHash' }
      const Subject = mkFunctionFixture(css)
      const component = TestUtils.renderIntoDocument(
        <div>
          <Subject />
        </div>
      )
      ReactDOM.findDOMNode(component).children[0].className.should.eql(
        css.content
      )
    })

    it('allows overrides to the stylesheet', () => {
      const newHash = 'anotherHash'
      const origCss = { content: 'hash' }
      const overrideCss = { content: newHash }
      const Subject = mkFunctionFixture(origCss)
      const component = TestUtils.renderIntoDocument(
        <div>
          <Subject css={overrideCss} />
        </div>
      )
      ReactDOM.findDOMNode(component).children[0].className.should.eql(newHash)
    })

    it('lets defaultProps pass through', () => {
      const Subject = mkFunctionFixture()
      Subject.defaultProps.aDefault.should.exist
      const component = TestUtils.renderIntoDocument(
        <div>
          <Subject />
        </div>
      )
      ReactDOM.findDOMNode(component).children[0].textContent.should.eql(
        'Content still here'
      )
    })

    it('lets propTypes pass through', () => {
      const Subject = mkFunctionFixtureWithReqPropTypes()
      /*
        Not sure how to really test the real problem where warnings aren't
        happening when a child component has been styleable'd. This at least
        tests the fix for the real problem.
      */
      Subject.propTypes.aReqProp.should.exist
    })
  })
})
