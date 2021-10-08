import Vue from "vue";
import "xe-utils";
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
Vue.use(VXETable);

// 给 vue 实例挂载内部对象，例如：
Vue.prototype.$XModal = VXETable.modal;
Vue.prototype.$XPrint = VXETable.print;
Vue.prototype.$XSaveFile = VXETable.saveFile;
Vue.prototype.$XReadFile = VXETable.readFile;
