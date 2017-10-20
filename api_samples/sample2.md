# 讀取指定範圍內的感測器數據

## api 參數說明

`f`

```
功能描述：設定回傳值格式
可設定值：html | json | geojson
```

`geometry`

```
功能描述：設定
{"rings":[[[13482171.440642975,2883345.1010674853],[13482911.924354507,2883345.1010674853],[13482911.924354507,2882757.4914125274],[13482171.440642975,2882757.4914125274],[13482171.440642975,2883345.1010674853]]],"spatialReference":{"wkid":102100}}
```

`geometryType`

esriGeometryPolygon

`spatialRel`

esriSpatialRelIntersects

`outFields`

*

returnGeometry

true

## api呼叫範例

[讀取指定範圍內的感測器數據](https://services7.arcgis.com/tVmMUEViFfyHBZvj/ArcGIS/rest/services/Bigdata/FeatureServer/54/query?f=json&geometry={"rings":[[[13482171.440642975,2883345.1010674853],[13482911.924354507,2883345.1010674853],[13482911.924354507,2882757.4914125274],[13482171.440642975,2882757.4914125274],[13482171.440642975,2883345.1010674853]]],"spatialReference":{"wkid":102100}}&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true)

```javascript
https://services7.arcgis.com/tVmMUEViFfyHBZvj/ArcGIS/rest/services/Bigdata/FeatureServer/54/query?f=json&geometry={"rings":[[[13482171.440642975,2883345.1010674853],[13482911.924354507,2883345.1010674853],[13482911.924354507,2882757.4914125274],[13482171.440642975,2882757.4914125274],[13482171.440642975,2883345.1010674853]]],"spatialReference":{"wkid":102100}}&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true)
```
