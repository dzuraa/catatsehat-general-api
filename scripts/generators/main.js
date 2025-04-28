// @ts-check
const fs = require('fs');
const path = require('path');
const hbs = require('handlebars');
const { cwd } = require('process');
const pluralize = require('pluralize');
const { startCase, get } = require('lodash');

const ORIGIN_PATH = cwd() + '/scripts/generators/resources';

const FOLDERS = [
  'controllers/http',
  // 'controllers/microservice',
  'dtos',
  'repositories',
  'services',
];

const slugify = (string) => {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const toCamelCase = (/** @type {string} */ str) => {
  // Lower cases the string
  return (
    str
      .toLowerCase()
      // Replaces any - or _ characters with a space
      .replace(/[-_]+/g, ' ')
      // Removes any non alphanumeric characters
      .replace(/[^\w\s]/g, '')
      // Uppercases the first character in each group immediately following a space
      // (delimited by spaces)
      .replace(/ (.)/g, function ($1) {
        return $1.toUpperCase();
      })
      // Removes spaces
      .replace(/ /g, '')
  );
};

const compile = (
  /** @type {string} */ content,
  { className, variableName, fileName, modelName, importPath },
) => {
  const template = hbs.compile(content)({
    className: className,
    variableName: variableName,
    fileName: fileName,
    modelName,
    importPath,
  });
  return template;
};

function getPrismaModel() {
  const prismaSchemaPath = path.join(cwd(), 'prisma', 'schema.prisma');
  const schemaContent = fs.readFileSync(prismaSchemaPath, 'utf-8');

  // Regex to match model definitions
  const modelRegex = /model\s+(\w+)\s+\{/g;

  const model = [];
  let match;
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    model.push(match[1]);
  }
  return model;
}

async function main() {
  const term = (await import('inquirer')).default;
  const model = getPrismaModel();

  const questions = [
    {
      type: 'confirm',
      name: 'isBaseModule',
      message:
        'Is the feature related to base module (children/mother/elderly)?',
    },
    {
      type: 'list',
      name: 'baseModule',
      message: 'Please choose the preferred module:',
      choices: ['children', 'mother', 'elderly'],
      when: (answers) => answers.isBaseModule,
    },
    {
      type: 'input',
      name: 'name',
      message: "What's your feature name?",
    },
    {
      type: 'list',
      name: 'model',
      message: 'Choose your Prisma model:',
      choices: model,
    },
  ];
  term.prompt(questions).then((answers) => {
    const pluralizeText = answers.name;
    const modelName = answers.model;
    const className = startCase(pluralizeText).replace(/ /g, '');
    const variableName =
      answers.model.charAt(0).toLowerCase() + answers.model.slice(1);
    const fileName = slugify(pluralizeText);

    // Set destination path
    let basePath = '/src/app/';
    if (answers.isBaseModule) {
      basePath += `${answers.baseModule}/`;
    }
    const dest = cwd() + basePath + fileName;

    // Create import path for templates
    let importPath = 'src/app/';
    if (answers.isBaseModule) {
      importPath += `${answers.baseModule}/`;
    }
    importPath += fileName;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    FOLDERS.forEach((folder) => {
      if (!fs.existsSync(`${dest}/${folder}`)) {
        fs.mkdirSync(`${dest}/${folder}`, { recursive: true });
      }
    });

    const files = [
      {
        path: `${dest}/index.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/index.hbs`, 'utf8'),
      },
      {
        path: `${dest}/${fileName}.module.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/module.hbs`, 'utf8'),
      },
      {
        path: `${dest}/controllers/index.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/controllers/index.hbs`,
          'utf8',
        ),
      },
      {
        path: `${dest}/controllers/http/${fileName}.controller.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/controllers/http/controller.hbs`,
          'utf8',
        ),
      },
      // {
      //   path: `${dest}/controllers/microservice/${fileName}.controller.ts`,
      //   content: fs.readFileSync(
      //     `${ORIGIN_PATH}/controllers/microservice/controller.hbs`,
      //     'utf8',
      //   ),
      // },
      {
        path: `${dest}/services/index.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/services/index.hbs`, 'utf8'),
      },
      {
        path: `${dest}/services/${fileName}.service.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/services/service.hbs`, 'utf8'),
      },
      {
        path: `${dest}/dtos/index.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/dtos/index.hbs`, 'utf8'),
      },
      {
        path: `${dest}/dtos/create-${fileName}.dto.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/dtos/create.hbs`, 'utf8'),
      },
      {
        path: `${dest}/dtos/update-${fileName}.dto.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/dtos/update.hbs`, 'utf8'),
      },
      {
        path: `${dest}/repositories/index.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/repositories/index.hbs`,
          'utf8',
        ),
      },
      {
        path: `${dest}/repositories/${fileName}.repository.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/repositories/repository.hbs`,
          'utf8',
        ),
      },
    ];

    files.forEach((file) => {
      const out = compile(file.content, {
        className,
        variableName,
        fileName,
        modelName,
        importPath,
      });

      fs.writeFileSync(file.path, out);
    });

    console.log(
      `✅ Feature '${pluralizeText}' generated successfully at '${dest}'`,
    );
  });
}

main();
