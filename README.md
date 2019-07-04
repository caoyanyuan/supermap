# superMap  自定义类 使用在vue

#### 文件目录
- entity
    - ship-local
- Event
    - Coordinate
        - CoordinateEvent
    - AbstractEvent
    - Emitter    封装 $.Callback 
    - SensorEvent
- gis
    - table
        - PointAbs
        - ShipPointAbs
- Model
    - Class
        - EntitesClickEvent
        - Layer   layer 图层类 
        - MapCtl  二次封装 new Cesium.Viewer
    - methods
        - getIds
    - CesiumCtl   默认地图的控制器,  MapCtl的实例
    - Entites     二次封装 entity 类
    - LayersCtl   对象  加载所有的layer实例



#### 初始化

    MapCtl -> CesiumCtl








