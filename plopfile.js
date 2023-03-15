module.exports = (plop) => {
  // create your generators here
  plop.setGenerator('component', {
      description: 'Nextjs Boilerplate',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Enter component name?',
        }
      ], // array of inquirer prompts
      actions: [
        {
          type: 'add',
          path: 'components/{{pascalCase name}}/{{pascalCase name}}.tsx',
          templateFile:
            'plop-templates/Component/Component.js.hbs',
        },
        {
          type: 'add',
          path:
            'components/{{pascalCase name}}/{{pascalCase name}}.module.css',
          templateFile:
            'plop-templates/Component/Component.module.css.hbs',
        },
        {
          type: 'add',
          path: 'components/{{pascalCase name}}/index.ts',
          templateFile: 'plop-templates/Component/index.js.hbs',
        },
        {
          // Adds an index.js file if it does not already exist
          type: 'add',
          path: 'components/index.ts',
          templateFile: 'plop-templates/injectable-index.js.hbs',

          // If index.js already exists in this location, skip this action
          skipIfExists: true,
        },
        {
          // Action type 'append' injects a template into an existing file
          type: 'append',
          path: 'components/index.ts',
          // Pattern tells plop where in the file to inject the template
          pattern: '/* PLOP_INJECT_IMPORT */',
          template: 'import {{pascalCase name}} from \'./{{pascalCase name}}\';',
        },
        {
          type: 'append',
          path: 'components/index.ts',
          pattern: '/* PLOP_INJECT_EXPORT */',
          template: '\t{{pascalCase name}},',
        },
      ]  // array of actions
  });

  plop.setGenerator('element', {
    description: 'Nextjs Boilerplate',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter elements name?',
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        path: 'components/elements/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile:
          'plop-templates/Component/Component.js.hbs',
      },
      {
        type: 'add',
        path:
          'components/elements/{{pascalCase name}}/{{pascalCase name}}.module.css',
        templateFile:
          'plop-templates/Component/Component.module.css.hbs',
      },
      {
        type: 'add',
        path: 'components/elements/{{pascalCase name}}/index.ts',
        templateFile: 'plop-templates/Component/index.js.hbs',
      },
      {
        // Adds an index.js file if it does not already exist
        type: 'add',
        path: 'components/elements/index.ts',
        templateFile: 'plop-templates/injectable-index.js.hbs',

        // If index.js already exists in this location, skip this action
        skipIfExists: true,
      },
      {
        // Action type 'append' injects a template into an existing file
        type: 'append',
        path: 'components/elements/index.ts',
        // Pattern tells plop where in the file to inject the template
        pattern: '/* PLOP_INJECT_IMPORT */',
        template: 'import {{pascalCase name}} from \'./{{pascalCase name}}\';',
      },
      {
        type: 'append',
        path: 'components/elements/index.ts',
        pattern: '/* PLOP_INJECT_EXPORT */',
        template: '\t{{pascalCase name}},',
      },
    ]  // array of actions
  });

   // create your generators here
  plop.setGenerator('form', {
    description: 'Nextjs Boilerplate',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter form name?',
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        path: 'components/forms/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile:
          'plop-templates/Component/Component.js.hbs',
      },
      {
        type: 'add',
        path:
          'components/forms/{{pascalCase name}}/{{pascalCase name}}.module.css',
        templateFile:
          'plop-templates/Component/Component.module.css.hbs',
      },
      {
        type: 'add',
        path: 'components/forms/{{pascalCase name}}/index.ts',
        templateFile: 'plop-templates/Component/index.js.hbs',
      },
      {
        // Adds an index.js file if it does not already exist
        type: 'add',
        path: 'components/forms/index.ts',
        templateFile: 'plop-templates/injectable-index.js.hbs',

        // If index.js already exists in this location, skip this action
        skipIfExists: true,
      },
      {
        // Action type 'append' injects a template into an existing file
        type: 'append',
        path: 'components/forms/index.ts',
        // Pattern tells plop where in the file to inject the template
        pattern: '/* PLOP_INJECT_IMPORT */',
        template: 'import {{pascalCase name}} from \'./{{pascalCase name}}\';',
      },
      {
        type: 'append',
        path: 'components/forms/index.ts',
        pattern: '/* PLOP_INJECT_EXPORT */',
        template: '\t{{pascalCase name}},',
      },
    ]  // array of actions
  });
};