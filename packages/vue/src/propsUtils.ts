import type { PropType } from 'vue';
import type { VueTypeValidableDef, VueTypeDef } from 'vue-types';
import type { UploadRequestHeader, UploadRequestMethod } from '@img-uploader/core';
export const initDefultProps = <T>(
  types: T,
  defaultProps: {
    [K in keyof T]?: T[K] extends VueTypeValidableDef<infer U>
      ? U
      : T[K] extends VueTypeDef<infer U>
      ? U
      : T[K] extends { type: PropType<infer U> }
      ? U
      : any;
  }
): T => {
  const propTypes: T = { ...types };
  Object.keys(defaultProps).forEach((k) => {
    const prop = propTypes[k] as VueTypeValidableDef;
    if (prop) {
      if (prop.type || prop.default) {
        prop.default = defaultProps[k];
      } else if (prop.def) {
        prop.def(defaultProps[k]);
      } else {
        propTypes[k] = { type: prop, default: defaultProps[k] };
      }
    } else {
      throw new Error(`not have ${k} prop`);
    }
  });
  return propTypes;
};

export const uploadProps = () => {
  return {
    // 唯一标识符
    id: String,
    multipart: { type: Boolean, default: undefined },
    // 发到后台的文件参数名
    name: { type: String, default: undefined },
    // 是否禁用
    disabled: { type: Boolean, default: undefined },
    // 接受上传的文件类型
    action: [String, Function],
    // 上传请求的 method
    method: String as PropType<UploadRequestMethod>,
    // 支持上传文件夹
    directory: { type: Boolean, default: undefined },
    // 上传所需参数返回data
    data: { type: [Object, Function], default: undefined },
    // 设置上传的请求头部
    headers: { type: Object as PropType<UploadRequestHeader>, default: undefined },
    // 接受上传的文件类型
    accept: { type: String, default: undefined },
    // 是否支持多选文件
    multiple: { type: Boolean, default: undefined },
    /* event api */
    onChange: Function,
    onDrop: Function,
    onPreview: Function,
    onDownload: Function,
    onRemove: Function,
    /* internal api */
    onBatchStart: Function,
    onReject: Function,
    onStart: Function,
    onError: Function,
    onSuccess: Function,
    onProgress: Function,
    beforeUpload: Function,
    // 覆盖默认上传行为，自定义上传方法
    customRequest: Function,
    // 上传请求时是否携带 cookie
    withCredentials: { type: Boolean, default: undefined },
    // 点击打开文件对话框
    openFileDialogOnClick: { type: Boolean, default: undefined },
    // 前缀class
    prefixCls: { type: String, default: undefined },
    // 显示手机设备捕获相册或者视频
    capture: [Boolean, String] as PropType<boolean | 'user' | 'environment'>,
    onMouseenter: Function,
    onMouseleave: Function,
    onClick: Function,
    /* icon property */
    removeIcon: Function,
    downloadIcon: Function,
    previewIcon: Function
  };
};
