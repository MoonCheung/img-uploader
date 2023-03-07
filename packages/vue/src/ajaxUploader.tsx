import type { CSSProperties } from 'vue';
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import { uploadProps } from './propsUtils';
import { Upload as defaultRequest, getUid, attrAccept, pickAttrs } from '@img-uploader/core';
import type { CustomFile, UploadProgressEvent, UploadRequestError, BeforeUploadFileType } from '@img-uploader/core';

interface ParsedFileInfo {
  origin: CustomFile;
  action: string;
  data: Record<string, unknown>;
  parsedFile: CustomFile;
}

export default defineComponent({
  name: 'AjaxUploader',
  inheritAttrs: false,
  props: uploadProps(),
  setup(props, { attrs, slots, emit, expose }) {
    const uid = ref(getUid());
    const reqs = Object.create(null);

    const fileInput = ref<HTMLInputElement>();

    let isMounted = false;

    // processFile
    const processFile = async (file: CustomFile, fileList: CustomFile[]): Promise<ParsedFileInfo> => {
      const { beforeUpload } = props;

      let transformedFile: BeforeUploadFileType | void = file;
      if (beforeUpload) {
        try {
          transformedFile = await beforeUpload(file, fileList);
        } catch (e) {
          // Rejection will also trade as false
          transformedFile = false;
        }
        if (transformedFile === false) {
          return {
            origin: file,
            parsedFile: null,
            action: null,
            data: null
          };
        }
      }

      // Get latest action
      const { action } = props;
      let mergedAction: string;
      if (typeof action === 'function') {
        mergedAction = await action(file);
      } else {
        mergedAction = action;
      }

      // Get latest data
      const { data } = props;
      let mergedData: Record<string, unknown>;
      if (typeof data === 'function') {
        mergedData = await data(file);
      } else {
        mergedData = data;
      }

      const parsedData =
        // string type is from legacy `transformFile`.
        // Not sure if this will work since no related test case works with it
        (typeof transformedFile === 'object' || typeof transformedFile === 'string') && transformedFile
          ? transformedFile
          : file;

      let parsedFile: File;
      if (parsedData instanceof File) {
        parsedFile = parsedData;
      } else {
        parsedFile = new File([parsedData], file.name, { type: file.type });
      }

      const mergedParsedFile: CustomFile = parsedFile as CustomFile;
      mergedParsedFile.uid = file.uid;

      return {
        origin: file,
        data: mergedData,
        parsedFile: mergedParsedFile,
        action: mergedAction
      };
    };

    // post
    const post = ({ data, origin, action, parsedFile }: ParsedFileInfo) => {
      if (!isMounted) return;

      const { onStart, customRequest, name, headers, withCredentials, method } = props;

      const { uid } = origin;
      const request = customRequest || defaultRequest;

      const requestOption = {
        action,
        filename: name,
        data,
        file: parsedFile,
        headers,
        withCredentials,
        method: method || 'post',
        onProgress: (e: UploadProgressEvent) => {
          const { onProgress } = props;
          onProgress?.(e, parsedFile);
        },
        onSuccess: (ret: any, xhr: XMLHttpRequest) => {
          const { onSuccess } = props;
          onSuccess?.(ret, parsedFile, xhr);
          delete reqs[uid];
        },
        onError: (err: UploadRequestError, ret: any) => {
          const { onError } = props;
          onError?.(err, ret, parsedFile);
          delete reqs[uid];
        }
      };

      onStart(origin);
      reqs[uid] = request(requestOption);
    };

    // reset
    const reset = () => {
      uid.value = getUid();
    };

    // abort
    const abort = (file?: any) => {
      if (file) {
        const uid = file.uid ? file.uid : file;
        if (reqs[uid] && reqs[uid].abort) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid] && reqs[uid].abort) {
            reqs[uid].abort();
          }
          delete reqs[uid];
        });
      }
    };

    onMounted(() => {
      isMounted = true;
    });

    onBeforeUnmount(() => {
      isMounted = false;
      abort();
    });

    const uploadFiles = (files: File[]) => {
      const originFiles = [...files] as CustomFile[];
      const postFiles = originFiles.map((file: CustomFile & { uid?: string }) => {
        // eslint-disable-next-line no-param-reassign
        file.uid = getUid();
        return processFile(file, originFiles);
      });

      // Batch upload files
      Promise.all(postFiles).then((fileList) => {
        const { onBatchStart } = props;

        onBatchStart?.(fileList.map(({ origin, parsedFile }) => ({ file: origin, parsedFile })));

        fileList.filter((file) => file.parsedFile !== null).forEach((file) => post(file));
      });
    };

    // onChange
    const onChange = (event: any) => {
      const { accept, directory } = props;
      const { files } = event.target as any;
      const acceptedFiles = [...files].filter((file: CustomFile) => !directory || attrAccept(file, accept));
      uploadFiles(acceptedFiles);
      reset();
    };

    const onClick = () => {};
    const onKeyDown = () => {};
    const onFileDrop = () => {};

    // 对外暴露属性或者方法
    expose({ abort });
    return () => {
      const { id, accept, prefixCls, disabled, capture, multiple, ...restProps } = props;

      const cls = {
        [prefixCls]: true,
        [`${prefixCls}-disabled`]: disabled,
        [attrs.class as string]: !!attrs.class
      };
      return (
        <div class={cls} style={attrs.style as CSSProperties}>
          <input
            {...pickAttrs(restProps, { aria: true, data: true })}
            id={id}
            type='file'
            key={uid.value}
            ref={fileInput}
            onClick={(e) => e.stopPropagation()}
            accept={accept}
            style={{ display: 'block' }}
            multiple={multiple}
            onChange={onChange}
            {...(capture != null ? { capture } : {})}
          />
          <label for={id} />
          {slots.default?.()}
        </div>
      );
    };
  }
});
