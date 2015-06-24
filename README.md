# react-styleable

A higher-order React Component that:

- Makes defining and using css styles consistent 
- Makes overriding styles in reusable components easy and predictable

## Install

```
npm install react-styleable --save-dev
```

## Dependencies

#### ES6

react-styleable source usings ES6+ features, including class definition, class properties, and es6 imports.

react-styleable also works very well when used as a class decorator.

For these reasons, I recommend [babel](https://babeljs.io/) as a JavaScript compiler option, best used in webpack's [babel-loader](https://github.com/babel/babel-loader).

#### CSS Modules

react-styleable assumes that your reusable component and consumers of that component will be using [CSS modules](https://github.com/css-modules/css-modules).

CSS Modules allow for:

- Writing CSS normally in a stylesheet in either vanilla CSS or any number of preprocessors (eg, Sass)
- Not having to worry about a global namespace, creating a per-use module around styles
- Defining explicity dependencies in your styles

To accomplish this, CSS Modules use a format called [Interoperable CSS (ICSS)](https://github.com/css-modules/icss).  Essentially, form describes the explicit export objects and import objects needed to make modules work.

I recommend using webpack's [css-loader](https://github.com/webpack/css-loader), which has [support for CSS Modules](https://github.com/webpack/css-loader#css-modules).

## Usage

react-styleable shines when used on reusable react components that has an accompanying stylesheet. 

Write your css as you usually would.  However, note that there's no need for a BEM-style namespacing.  This is because these styles will be scoped to your local module.

```css my-list.css
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

Then in your reusable component, wrap your React.Component in this higher-order component.  A decorator will work quite nicely:

```js
import styleable from 'react-styleable'

@styleable(require('./my-list.css'))
export default class MyList extends React.Component {
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
```

Now you can use the `MyList` component above and it will be styled as specified.


```js
import MyList from './my-list'

React.render(<MyList />, document.getElementById('app'))
```

If you want to override this React Component's styles as the consumer, you can easily do so, through the same, consistent interface.  First, define a new stylesheet:

```css client.css
.item {
  outline: 1px solid blue;
}
```

```js
import MyList from './my-list'

import css from './client.css'

React.render(<MyList css={css} />, document.getElementById('app'))
```

Now the `.item`s outline will be blue instead of the original red.

Styled. Portable. Easily overridden.  So, so good.