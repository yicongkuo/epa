# 讀取時間區段內感測器的數據

## url 

https://<featurelayer-url>/<featureId>/query

## api 參數說明

`f`

```
功能描述：設定回傳值格式
可設定值：html | json | geojson
```

`where`

```
功能描述：設定查詢條件
可設定值：任何合法的SQL where子句
```

**範例說明**

 - 圖層屬性中，有一個欄位名稱為`deviceId`，使用`字串`方式記錄
   感測器的編號。如果想要查詢編號1875819825感測器的所有數據時，
   可使用以下指令：
	
   ```
     where = deviceId='1875819825'
   ```
 - 想要查詢`2017/06/21 早上03:05` ~ `2017/06/21 早上04:32`
   之間的所有資料，可使用以下指令：
	
   ```
     where = time > '2017/06/21 03:05:00' AND time < '2017/06/21 04:32:00'
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

[讀取指定範圍內的感測器數據](https://services7.arcgis.com/tVmMUEViFfyHBZvj/ArcGIS/rest/services/Bigdata/FeatureServer/54/query?f=html&where=time%3E%20%272017/06/21%2003:05:00%27%20AND%20time%20%3C%20%272017/06/21%2004:32:00%27%20AND%20deviceId%20=%201875819825&returnGeometry=true&outFields=*)

`https://services7.arcgis.com/tVmMUEViFfyHBZvj/ArcGIS/rest/services/Bigdata/FeatureServer/54/query?f=json&where=time%3E%20%272017/06/21%2003:05:00%27%20AND%20time%20%3C%20%272017/06/21%2004:32:00%27%20AND%20deviceId%20=%201875819825&returnGeometry=true&outFields=*`