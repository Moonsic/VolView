import Main from './Index.vue';
Main.install = function(Vue) {
    Vue.component(Main.name, Main);
};
export default Main;