import { defineComponent, ref, PropType } from 'vue';
import { Upload } from '@img-uploader/core';

const ImgUploader = defineComponent({
  name: 'ImgUploader',
  props: {
    id: String,
    name: String,
    accept: {
      type: String,
      default: 'image/*,video/*'
    },
    prefixCls: String as PropType<string | any>,
    disabled: {
      type: Boolean,
      default: undefined
    },
    capture: [Boolean, String] as PropType<boolean | 'user' | 'environment'>
  },
  setup(props, { attrs, slots, emit, expose }) {
    const { id, accept, prefixCls, disabled, capture, ...otherProps } = props;

    // TODO onChange event
    const onChange = (event: any) => {
      console.log('upload event:', event);
    };

    const cls = {
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: disabled,
      [attrs.class as string]: !!attrs.class
    };

    const fileInput = ref<HTMLInputElement>();
    return () => (
      <div class={cls} style={attrs.style as string}>
        <input type='file' id={id} accept={accept} style={{ display: 'block' }} capture={capture} onChange={onChange} />
        <label for={id} />
      </div>
    );
  }
});

export default ImgUploader;
