const render = require('../index');
const path = require('path');

test('Throws error on missing template', async () => {
  await expect(render()).rejects.toThrow('Template argument expected');
});

test('Throws error on missing template src', async () => {
  await expect(render({})).rejects.toThrow('Template argument must contain src or content');
});

test('Throws error on invalid data argument', async () => {
  await expect(render({content: 'Test'}, 15)).rejects.toThrow('Data argument must be an object');
});

test('Throws error on invalid template content', async () => {
  await expect(render({content: 15})).rejects.toThrow('Template content must be typeof string');
});

test('Throws error when template src file does not exist', async () => {
  await expect(render({src: 'does/not/exist.tmpl'})).rejects.toThrow('Template src file does not exist');
});

test('Throws error when template partials is not an array', async () => {
  const template = {
    content: 'Hello',
    partials: {}
  };
  await expect(render(template)).rejects.toThrow('Expected partials to be an array');
});

test('returns content from template string', async () => {
  const template = {
    content: '{{greeting}} {{name}}'
  };
  const data = {
    greeting: 'Hello',
    name: 'World'
  };
  const content = await render(template, data);
  expect(content).toBe('Hello World');
});

test('returns content from template string with partials', async () => {
  const template = {
    content: `{{greeting}} {{name}} {{> partial}}`,
    partials: [
      {name: 'partial', content: 'This is a partial'}
    ]
  };
  const data = {
    greeting: 'Hello',
    name: 'World'
  };
  const content = await render(template, data);
  expect(content).toBe('Hello World This is a partial');
});

test('returns content from template', async () => {
  const src = path.join('__tests__', 'artifacts', 'hello.tmpl');
  const template = {
    src
  };
  const data = {
    name: 'World'
  };
  const content = await render(template, data);
  expect(content).toBe('Hello World');
});

test('returns content from template with partial src file', async () => {
  const src = path.join('__tests__', 'artifacts', 'partial.tmpl');
  const template = {
    content: 'Hello {{> info}}',
    partials: [
      {
        name: 'info',
        src
      }
    ]
  };
  const data = {
    name: 'World'
  };
  const content = await render(template, data);
  expect(content).toBe('Hello This is a partial, World');
});