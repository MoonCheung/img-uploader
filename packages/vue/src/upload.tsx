import { defineComponent, ref, onMounted } from 'vue';
import AjaxUploader from './ajaxUploader';
import type { CustomFile } from '@img-uploader/core';
import { initDefultProps, uploadProps } from './propsUtils';

export default defineComponent({
  name: 'Upload',
  inheritAttrs: false,
  props: initDefultProps(uploadProps(), {
    prefixCls: 'img-uploader',
    data: {},
    headers: {},
    accept: 'image/*,video/*',
    name: 'file',
    multipart: false,
    onStart: () => {},
    onError: () => {},
    onSuccess: () => {},
    multiple: false,
    beforeUpload: null,
    customRequest: null,
    withCredentials: false,
    openFileDialogOnClick: true
  }),
  setup(props, { slots, attrs, expose }) {
    const uploader = ref();

    const handleInternalChange = (file, changedFileList, event?: { percent: number }) => {
      let cloneList = [...changedFileList];
      // Cut to match count
      if (props.maxCount === 1) {
        cloneList = cloneList.slice(-1);
      } else if (props.maxCount) {
        cloneList = cloneList.slice(0, props.maxCount);
      }

      setMergedFileList(cloneList);

      const changeInfo: UploadChangeParam<UploadFile> = {
        file: file as UploadFile,
        fileList: cloneList
      };

      if (event) {
        changeInfo.event = event;
      }
      props['onUpdate:fileList']?.(changeInfo.fileList);
      props.onChange?.(changeInfo);
      // formItemContext.onFieldChange();
    };

    onMounted(() => {
      console.log('onMounted 已挂载...');
    });

    // abort
    const abort = (file: CustomFile) => {
      uploader.value?.abort(file);
    };
    expose({ abort });
    return () => {
      return <AjaxUploader {...props} {...attrs} v-slots={slots} ref={uploader} />;
    };
  }
});
