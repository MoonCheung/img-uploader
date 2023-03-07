import type { Plugin, App } from 'vue';
import Component from './upload';

export const ImgUploader = Component;
export const install: Plugin = function (app: App) {
  app.component(Component.name, Component);
  return app;
};

export default {
  ImgUploader: Component,
  install
};
