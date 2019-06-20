import SuperMap from '@/components/superMap'

const baseComponents = {
    install: function(Vue) {
  
      Vue.component("SuperMap", SuperMap);
    }
  };
  export default baseComponents;