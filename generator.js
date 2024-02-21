const fs = require('fs');
const path = require('path');

/**
 * @type {Object} templates
 * @property {string} Icon.tsx - The content of the Icon.tsx file.
 * @property {string} index.tsx - The content of the index.tsx file.
 */
const templates = {
  'Icon.tsx': `import {CSSProperties, DOMAttributes, FC, FunctionComponent, memo, SVGProps} from 'react';
import * as iconComponents from './icons';
import { IconType } from './types';

export interface IconProps {
  className?: string;
  name: IconType;
  size?: number;
  width?: number;
  height?: number;
  fill?: string;
  style?: CSSProperties;
  onClick?: DOMAttributes<SVGSVGElement>['onClick'];
}

export const iconTestId = 'icon';

const getIconName = (name: IconType) => \`Icon\${name}\`;

export const Icon: FC<IconProps> = memo(({ className, name, fill = 'currentColor', size, width, height, style, onClick, ...rest }) => {
  const IconComponent =
    (iconComponents[getIconName(name) as keyof typeof iconComponents] as FunctionComponent<SVGProps<SVGSVGElement>>) ||
    null;

  return (
    IconComponent && (
      <IconComponent
        onClick={onClick}
        data-testid={iconTestId}
        fill={fill}
        data-name={name}
        className={className}
        style={{ ...style, width: size ?? width, height: size ?? height }}
        {...rest}
      />
    )
  );
});

`,
  'index.tsx': `export * from './Icon';
export * from './types';

`,
};

/**
 * Check all the svg files in the input directory and remove width, height and fill attributes.
 * @param {string} inputDir - The directory where the svg iocns located.
 */
function cleanAllIcons(inputDir) {
  console.log(`🧹 Cleaning SVG icons: ${inputDir}`);
  fs.readdir(inputDir, (err, files) => {
    files.forEach((file) => {
      if (file.endsWith('.svg')) {
        fs.readFile(`${inputDir}${file}`, 'utf8', (err, data) => {
          if (err) {
            return;
          }
          const result = data.replace(/(width|height|fill)="[^"]*"/g, '');
          fs.writeFileSync(`${inputDir}${file}`, result, 'utf8');
        });
      }
    });
    if (err) {
      console.log(`🚨 Failed to clean SVG icons: ${inputDir}`);
    } else {
      console.log(`🧹 SVG icons cleaned: ${inputDir}`);
    }
  });
}

/**
 * Creates files from templates if they do not already exist in the specified output directory.
 * @param {string} outputDir - The output directory where the files will be created.
 */
function createFilesFromTemplatesIfNotExist(outputDir) {
  const files = Object.keys(templates);

  files.forEach((file) => {
    if (!fs.existsSync(`${outputDir}${file}`)) {
      fs.writeFileSync(`${outputDir}${file}`, templates[file]);
      console.log(`✅ Created file: ${file}`);
    }
  });
}

/**
 * Converts a text to PascalCase.
 * @param {string} text - The text to be converted.
 * @returns {string} The converted text in PascalCase.
 */
function toPascalCase(text) {
  return text
    .replace(/[-\s]+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Creates folders if they do not exist.
 * @param {string} inputDir - The input directory path.
 * @param {string} outputDir - The output directory path.
 */
function createFoldersIfNotExist(inputDir, outputDir) {
  const folders = [inputDir, outputDir];

  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`✅ Created folder: ${folder}`);
    }
  });
}

/**
 * Calculates the export path for a given input and output path.
 * @param {string} inputDir - The input path.
 * @param {string} outputDir - The output path.
 * @returns {string} - The export path.
 */
function getExportPath(inputDir, outputDir) {
  const relativePath = path.relative(outputDir, inputDir);
  const exportPath = relativePath.startsWith('.')
    ? relativePath
    : `./${relativePath}`;
  return exportPath.endsWith('/') ? exportPath : `${exportPath}/`;
}

/**
 * Filters an array of files and returns only the files that have a '.svg' extension.
 * @param {string[]} files - The array of file names to filter.
 * @returns {string[]} - The filtered array of file names.
 */
function getFilteredFiles(files) {
  return files.filter((file) => file.endsWith('.svg'));
}

/**
 * Generates a typescript file containing the icon types based on the input directory.
 * @param {string} inputDir - The input directory path.
 * @param {string} outputDir - The output directory path.
 * @param {string} [filename='types.ts'] - The name of the generated file.
 */
function createIconTypesFile(inputDir, outputDir, filename = 'types.ts') {
  fs.readdir(inputDir, (err, files) => {
    try {
      const endExport = `

export type IconType = typeof iconNames[number];
`;
      const filteredFiles = getFilteredFiles(files);
      const iconTypes = filteredFiles.length
        ? filteredFiles.reduce((prev, cur, idx) => {
            return `${prev}
    '${cur.replace('.svg', '')}'${
              filteredFiles.length === idx + 1
                ? `,
] as const;${endExport}`
                : ','
            }`;
          }, 'export const iconNames = [')
        : `export const iconNames = [] as const;${endExport}`;

      fs.writeFileSync(`${outputDir}/${filename}`, iconTypes);
      console.log(`🧩 ${filename} file generated`);
    } catch {
      console.log(`🚨 ${filename} generation failure`);
    }
  });
}

/**
 * Generates an icons file based on the input directory containing SVG files.
 * The generated file exports React components for each SVG file.
 *
 * @param {string} inputDir - The input directory path.
 * @param {string} outputDir - The output directory path.
 * @param {string} [filename='icons.ts'] - The name of the generated file.
 */
function createIconsFile(inputDir, outputDir, filename = 'icons.ts') {
  fs.readdir(inputDir, (err, files) => {
    try {
      const filteredFiles = getFilteredFiles(files);
      const icons = filteredFiles.length
        ? filteredFiles.reduce((prev, cur) => {
            return `${prev}export { ReactComponent as Icon${toPascalCase(
              cur.replace('.svg', ''),
            )} } from '${getExportPath(inputDir, outputDir)}${cur}';
`;
          }, '')
        : `export {};
`;

      fs.writeFileSync(`${outputDir}/${filename}`, icons);
      console.log(`💚 ${filename} file generated`);
    } catch {
      console.log(`🚨 ${filename} generation failure`);
    }
  });
}

/**
 * Generates SVG icons and related files based on the input directory.
 *
 * @param {string} inputDir - The input directory containing SVG files.
 * @param {string} outputDir - The output directory where the generated files will be saved.
 * @param {boolean} cleanSvg - A flag to remove unnecessary attributes from SVG files.
 */
function generate(inputDir, outputDir, cleanSvg) {
  // Step 1: Create folders if they do not exist
  createFoldersIfNotExist(inputDir, outputDir);

  // Step 2: Create files from templates if they do not already exist
  createFilesFromTemplatesIfNotExist(outputDir);

  // Step 3: Generate a typescript file containing the icon types based on the input directory
  createIconTypesFile(inputDir, outputDir);

  // Step 4: Generate an icons file based on the input directory containing SVG files
  createIconsFile(inputDir, outputDir);

  // Step 5: Clean all the svg files in the output directory
  if (cleanSvg) {
    cleanAllIcons(inputDir);
  }
}

module.exports = generate;
