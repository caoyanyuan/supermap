import SuperMap from '@/components/superMap'
console.log(SuperMap + '进来了')

const baseComponents = {
    install: function(Vue) {
        Vue.component("SuperMap", SuperMap);
    }
  };
  export default baseComponents;