const Mustache = require('mustache');
const fse = require('fs-extra');
const fs = require('fs');

const EMPTY_STR = '';

function hasContent(item) {
  return item.content && item.content.length > 0;
}

async function validate(template, data) {
  if (!template) {
    throw Error('Template argument expected');
  }

  if (!template.src && !template.content) {
    throw Error('Template argument must contain src or content');
  }

  if (template.src) {
    const exists = await fse.pathExists(template.src);
    if (!exists) {
      throw Error('Template src file does not exist');
    }
  }

  if (Object.prototype.hasOwnProperty.call(template, 'content') === true &&
      typeof template.content !== 'string') {
    throw Error('Template content must be typeof string');
  }

  if (data != null && typeof data !== 'object') {
    throw Error('Data argument must be an object');
  }

  if (Object.prototype.hasOwnProperty.call(template, 'partials') === true &&
      Array.isArray(template.partials) === false) {
    throw Error('Expected partials to be an array');
  }
}

async function getContent(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, content) => {
      if (err) {
        return reject(err);
      }
      return resolve(content);
    });
  });
}

async function getTemplateContent(template) {
  let promise = null;
  if (hasContent(template) === true) {
    promise = template.content;
  } else {
    promise = getContent(template.src);
  }
  let main = null;
  try {
    main = await Promise.resolve(promise);
  } catch(e) {
    throw Error(`Failed to get template content ${e.message}`);
  }
  return main;
}

async function processPartials(template) {
  const promises = [];  
  const partialsIdx = [];

  if (template.partials) {
    for (let x = 0; x < template.partials.length; x += 1) {
      const partial = template.partials[x];
      partialsIdx.push(partial.name);
      
      if (hasContent(partial) === true) {
        promises.push(partial.content);
      } else {
        var exists = await fse.pathExists(partial.src);
        if (exists === true) {
          promises.push(getContent(partial.src));
        } else {
          promises.push(EMPTY);
        }
      }      
    }
  }
  return {
    promises,
    idx: partialsIdx
  };
}

module.exports = async function stacheRender(template, data) {
  await validate(template, data);
  
  const main = await getTemplateContent(template);
  const partialData = await processPartials(template);

  let results = null;
  try {
    if (partialData.promises.length > 0) {
      results = await Promise.all(partialData.promises);
    }    
  } catch(e) {
    throw Error(`There was an error retrieving one or more files. ${e.message}`);
  }

  const partials = {};
  if (results && Array.isArray(results)) {
    for (let x = 0; x < partialData.idx.length; x += 1) {
      const name = partialData.idx[x];
      partials[name] = results[x];
    }
  }

  let content = EMPTY_STR;
  try {
    if (main !== EMPTY_STR) {
      content = Mustache.render(main, data, partials);
    }
  } catch(e) {
    throw Error(`Failed to render mustache template ${e.message}`);
  }
  return content;
};