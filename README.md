## stache-render
A module to render a string using [Mustache](https://mustache.github.io/mustache.5.html) templating.

`stache-render` provides a flexible way to render content from template and partials all in one request.

Pass in any combination of file paths and strings. Use the simple and familiar  `mustache` template syntax.

>Note: the render function is an `async` function.

### Install
```
npm i stache-render
```

### Examples

**With template file**
```javascript
const render = require("stache-render");

const template = {
  src: "path/to/template.tmpl"
};

const someData = {
  greeting: "Hello",
  name: "World"
};
const content = await render(template, someData);
```
**With string**
```javascript
const render = require("stache-render");

const template = {
  content: "Guess what? {{answer}}"
};

const someData = {
  answer: "Chicken butt"
};
const content = await render(template, someData);
```

**Template Parameter Schema**

>Note: each template item can have a `src` property which specifies a filepath OR `content` property containing a template string.

An array of `partials` may optionally be included, if you're into that sort of thing. Each `partial` follows the same convention, it can have a `src` OR `content` property. Additionally, it must have a `name` property, so it can be matched in the template.

```javascript
{
  src: "/path/to/template",
  content: "Hello {{name}}, this is a template. {{> header}}"
  partials: [
    {
      name: "header",
      content: "This is a partial and don't you forget it"
    }
  ]
}
```