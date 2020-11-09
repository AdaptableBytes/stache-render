## stache-render
A module to render a string using Mustache templating.

`stache-render` provides a flexible way to render content from template and partials all in one request.

Pass in any combination of file paths and strings. Use the simple and familiar  `mustache` template syntax.

### Install
```
npm i stache-render
```

### Examples


```javascript
const render = require('stache-render');

const template = {
  src: 'path/to/template.tmpl'
};

const someData = {
  greeting: 'Hello',
  name: 'World'
};
const content = await render(template, someData);
```
