import type { CustomFile } from './interface';
import { attributes, eventsName } from './constans';

export interface PickConfig {
  aria?: boolean;
  data?: boolean;
  attr?: boolean;
}

let index = 0;
const ariaPrefix = 'aria-';
const dataPrefix = 'data-';
const propList = `${attributes} ${eventsName}`.split(/[\s\n]+/);

export const getUid = () => `img-uploader-${Date.now()}-${++index}`;

export const attrAccept = (file: CustomFile, acceptedFiles: string | string[]) => {
  if (file && acceptedFiles) {
    const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(',');
    const fileName = file.name || '';
    const mimeType = file.type || '';
    const baseMimeType = mimeType.replace(/\/.*$/, '');

    return acceptedFilesArray.some((type) => {
      const validType = type.trim();
      // This is something like */*,*  allow all files
      if (/^\*(\/\*)?$/.test(type)) {
        return true;
      }

      // like .jpg, .png
      if (validType.charAt(0) === '.') {
        const lowerFileName = fileName.toLowerCase();
        const lowerType = validType.toLowerCase();

        let affixList = [lowerType];
        if (lowerType === '.jpg' || lowerType === '.jpeg') {
          affixList = ['.jpg', '.jpeg'];
        }

        return affixList.some((affix) => lowerFileName.endsWith(affix));
      }

      // This is something like a image/* mime type
      if (/\/\*$/.test(validType)) {
        return baseMimeType === validType.replace(/\/.*$/, '');
      }

      // Full match
      if (mimeType === validType) {
        return true;
      }

      // Invalidate type should skip
      if (/^\w+$/.test(validType)) {
        console.warn(`Upload takes an invalidate 'accept' type '${validType}'.Skip for check.`);
        return true;
      }

      return false;
    });
  }
  return true;
};

/**
 * Picker props from exist props with filter
 * @param props Passed props
 * @param ariaOnly boolean | { aria?: boolean; data?: boolean; attr?: boolean; } filter config
 */
export function pickAttrs(props: object, ariaOnly: boolean | PickConfig = false) {
  let mergedConfig = Object.create(null);
  if (ariaOnly === false) {
    mergedConfig = {
      aria: true,
      data: true,
      attr: true
    };
  } else if (ariaOnly === true) {
    mergedConfig = {
      aria: true
    };
  } else {
    mergedConfig = {
      ...ariaOnly
    };
  }

  const attrs = Object.create(null);
  Object.keys(props).forEach((key) => {
    if (
      // Aria
      (mergedConfig.aria && (key === 'role' || key.indexOf(ariaPrefix) === 0)) ||
      // Data
      (mergedConfig.data && key.indexOf(dataPrefix) === 0) ||
      // Attr
      (mergedConfig.attr && (propList.includes(key) || propList.includes(key.toLowerCase())))
    ) {
      attrs[key] = props[key as keyof typeof props];
    }
  });
  return attrs;
}
