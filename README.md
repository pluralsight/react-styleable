# react-styleable

Consistent, easy overrides for CSS Modules in React Components

## Install

```
npm install react-styleable --save-dev
```

## Usage

### Styles in Props

`react-styleable` makes your styles from your CSS modules available on `props.css`.

Write your stylesheet with all the perks of [css modules](https://github.com/css-modules/css-modules).  For example:

```css
.list {
  list-style: none;
  padding-left: 0;
  margin: 10px;
}
.item {
  outline: 1px solid red;
  padding: 10px;
}
```

Then in your reusable component, wrap your React.Component in `react-styleable`'s higher-order component.

```js
import styleable from 'react-styleable'

import css from './my-list.css'

class MyList extends React.Component {
  renderItem(item, i) {
    return (
      <li key={i} className={this.props.css.item}>{item}</li>
    )
  }
  renderList(items) {
    return items.map(this.renderItem)
  }
  render() {
    return (
      <ul className={this.props.css.list}>
        {this.renderList(this.props.items)}
      </ul>
    )
  }
}

export default styleable(css)(MyList)
```

Usage as a decorator is also nice:

```js
@styleable(css)
class MyList extends React.Component { /* ... */ }
```

Your `MyList` component is now styled and ready to display!

### Overriding Component Styles

This is the big payoff.

If you want to override this component's styles as the consumer, you can easily do so, through the same, consistent interface.  First, define a new stylesheet:

```css
.item {
  outline: 1px solid blue;
}
```

And use it to render `MyList` again, passing your new stylesheet via the `props.css` prop:

```js
import MyList from './my-list'

import css from './client.css'

React.render(<MyList css={css} />, document.getElementById('app'))
```

Now the `.item`s outline will be blue instead of the original red.

### Composing Component Styles

If instead of just overriding the styles, you wanted to add to them with style composition, you can do that as well.

One method is via CSS modules' [`composes`](https://github.com/css-modules/css-modules#composition) keyword.  In your new stylesheet:

```css
.item {
  composes: item from "./my-list.css";
  background: pink;
}
```

Now the original red outline will remain and a pink background will be present as well.  This is the most surefire way to compose styles because it allows you to guarantee the order of the cascade.  

But it has the downside of having to locate the original stylesheet location.

If you have enough assurances on the cascade order and selector specificity, all potential concerns, you can use the `compose` api via the `react-styleable` to accomplish the same thing (in `react-styleable@3.1.0`):

```js
import MyList from './my-list'

import css from './client.css'

React.render(<MyList css={{ compose: css }} />, document.getElementById('app'))
```

Styled. Portable. Easily overridden.  So, so good.
