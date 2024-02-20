# @onlyredcats/svg-to-react

This is a CLI tool for generating React icons from SVG files. It generates a React component for each SVG file and exports them as a single module with a common interface and types for the icons.

## Installation

To install the package run the following command:

```bash
npm install @onlyredcats/svg-to-react
```

## Usage
Use the following command to generate React icons from SVG files:
```bash
svg-to-react --output="./src/components/Icon/" --input="./src/assets/"
```

In this command:

- `--output` specifies the path to the output directory where the generated React icon files will be saved.
- `--input` specifies the path to the directory where the SVG files are located.

## Example
Let's assume you have the following directory structure:

```
my-project/
├── src/
│   ├── assets/
│   │   ├── icon1.svg
│   │   └── icon2.svg
│   └── components/
│       └── common/
│           └── Icon/
└── package.json
```

To generate React icons from SVG files in the `src/assets` directory and save them in `src/components/common/Icon`, you can run the mentioned command
```bash
svg-to-react --output="./src/components/Icon/" --input="./src/assets/"
```

After running CLI command, the `src/components/common/Icon` directory will contain generated React icon files based on the SVG files.
```
my-project/
├── src/
│   ├── assets/
│   │   ├── icon1.svg
│   │   └── icon2.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Icon/
│   │   │   │   ├── Icon.tsx
│   │   │   │   ├── icons.ts
│   │   │   │   ├── index.tsx
│   │   │   │   └── types.ts
└── package.json
```

### Generated files
`Icon.tsx` - contains the React component for the icon.
```tsx
import {CSSProperties, DOMAttributes, FC, FunctionComponent, memo, SVGProps} from 'react';
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

const getIconName = (name: IconType) => `Icon${name}`;

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
```
<hr>
<br>

`icons.ts` - contains the imports of the icons.
```ts
export { ReactComponent as IconIcon1 } from '../../svg/icon1.svg';
export { ReactComponent as IconIcon2 } from '../../svg/icon2.svg';
```

<hr>
<br>

`index.tsx` - contains the exports of the icons.
```tsx
export * from './Icon';
export * from './types';
```

<hr>
<br>

`types.ts` - contains the types of the icons.
```ts
export const iconNames = [
  'icon1',
  'icon2',
] as const;

export type IconType = typeof iconNames[number];

```

## Contributing
Contributions are welcome. Please open an issue or submit a pull request.

## Author
Oleksandr Ratushnyi

[https://sashkoratushnyi.com](https://sashkoratushnyi.com)

## License
This package is distributed under the MIT license.