# 讀取指定工業區內，汙染物指數超標的範圍

## url 

https://<featurelayer-url>/<featureId>/query

## api 參數說明

`f`

```
功能描述：設定回傳值格式
可設定值：html | json | geojson
```

`geometry`

```
功能描述：設定指定範圍的幾何數據
可設定值：使用以下網頁取得指定工業區範圍幾何數據
```
[取得指定範圍幾何數據網頁](https://yicongkuo.github.io/epa/apps/GetGeometryParams/)

`geometryType`

```
功能描述：`gemoetry`參數的幾何類型
可設定值：esriGeometryPolygon
```

`spatialRel`

```
功能描述：幾何圖形的空間關係
可設定值：esriSpatialRelIntersects
```

`outFields`

```
功能描述：設定要回傳的欄位資料，所有欄位都要回傳可以使用米字號*
可設定值：欄位名稱1, 欄位名稱2,... | *
```

`returnGeometry`

```
功能描述：是否回傳經緯度或幾何數據
可設定值：true | false
```

## api呼叫範例

[讀取指定範圍內的感測器數據](https://services7.arcgis.com/tVmMUEViFfyHBZvj/ArcGIS/rest/services/EPA_API_Sample_Data/FeatureServer/0/query?geometry=%7B%22rings%22%3A%5B%5B%5B13481982.73672939%2C2883512.307066864%5D%2C%5B13483339.493981488%2C2883512.307066864%5D%2C%5B13483339.493981488%2C2882423.079413771%5D%2C%5B13481982.73672939%2C2882423.079413771%5D%2C%5B13481982.73672939%2C2883512.307066864%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&f=html)

`https://services7.arcgis.com/tVmMUEViFfyHBZvj/ArcGIS/rest/services/EPA_API_Sample_Data/FeatureServer/0/query?geometry={"rings":[[[13481982.73672939,2883512.307066864],[13483339.493981488,2883512.307066864],[13483339.493981488,2882423.079413771],[13481982.73672939,2882423.079413771],[13481982.73672939,2883512.307066864]]],"spatialReference":{"wkid":102100}}&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&f=html`