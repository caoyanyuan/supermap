const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    host: "lichen.gbei.com",
    proxy: {
      "/api": {
        target: "https://www.gbei.com/",
        // target: "http://test.gbei.com",
        // target: "http://tiyan.gbei.com",
        ws: true,
        changeOrigin: true
      },
      "/mapData": {
        target: "http://127.0x.0.1:2009/mapData", // http://192.168.1.112:8000 http://api.gbei.com:81 http://192.168.1.3 192.168.1.178:8090
        changeOrigin: false
      }
    }
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("common", resolve("src/common"))
      .set("assets", resolve("src/assets"));
  },
  pwa: {
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      importWorkboxFrom: "local"
      // ...other Workbox options...
    }
  }
};
