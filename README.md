# superMap  自定义类 使用在vue

#### 文件目录
- entity                        Entites类的实例
    - _all-ship                 所有渔船
    - ais     
    - beidou
    - ship-hkm                  港澳渔船
    - ship-local                本地渔船
- Event
    - Coordinate
        - CoordinateEvent
    - AbstractEvent 
    - Emitter                   封装 $.Callback 
    - SensorEvent
- gis
    - shipPoint                 渔船的子类  一种渔船都对应着entity
        - all                   gis页面上所有渔船  负责统一操作页面里面的渔船  -- ShipAllAbs
        - ais                   ais所有渔船         -- ShipPointAbs
        - beidou                北斗所有渔船        -- ShipPointAbs
        - hkm                   港澳所有渔船        -- ShipPointAbs
        - local                 本地渔船            -- ShipPointAbs
    - table                     地图上要显示的渔船以及区域各种点的类
        - PointAbs              对于entity实例的操作  基类 
        - ShipPointAbs          重点关注渔船        -- PointAbs
        - ShipAllAbs            所有渔船            -- ShipPointAbs
        - AreaAbs               画一块区域          -- PointAbs    
        - ParkPointAbs          泊位管理            -- AreaAbs
        - EventPoint            事件管理            -- PointAbs
        - WaterPoint            敏感水域            -- AreaAbs
- Model
    - Class
        - EntitesClickEvent
        - Layer                 layer 图层类 
        - MapCtl                二次封装 new Cesium.Viewer
    - methods
        - getIds
    - CesiumCtl                 默认地图的控制器,  MapCtl的实例
    - Entites                   二次封装 entity 类
    - LayersCtl                 对象  加载所有的layer实例

- views
    - health  
    - gis                       gis地图操作页面



#### 初始化

    MapCtl -> CesiumCtl


#### 卫生管理
    撒点
    > 如果子类中存在构造函数，则需要在使用“this”之前首先调用 super()

    HealthPoint -> ShipPointAbs ->  PointAbs

#### test UML
```
graph LR;
  A-->B
  B-->C
  C-->D
  D-->A
```




