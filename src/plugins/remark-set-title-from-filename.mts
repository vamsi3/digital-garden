import type { Root } from 'mdast';
import type { VFile } from 'vfile';
import type { Plugin } from 'unified';

interface AstroFileProperties {
  astro: {
    frontmatter: {
      title?: string;
      [key: string]: any;
    };
  };
  [key: string]: any;
}

export const remarkSetTitleFromFilename: Plugin<[], Root, Root> = () => {
  return (tree: Root, file: VFile): void => {
    const fileData = file.data as AstroFileProperties;
    fileData.astro.frontmatter.title = file.stem;
  };
};
