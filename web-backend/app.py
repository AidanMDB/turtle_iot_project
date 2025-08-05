from influxdb_client import InfluxDBClient
from influxdb_client.client.query_api import SYNCHRONOUS
from flask import Flask, jsonify, request
import os

app = Flask(__name__)


client = InfluxDBClient(
    username=os.environ.get('INFLUXDB_USER'),
    password=os.environ.get('INFLUXDB_PASSWORD'),
    url=os.environ.get('INFLUXDB_URL'),
    token=os.environ.get('INFLUXDB_TOKEN'),
    org=os.environ.get('INFLUXDB_ORG')
)



def flux_query(time, parameter):
    query_api = client.query_api()
    result = query_api.query(
        f'''
        from(bucket:{os.environ.get("INFLUXDB_BUCKET")})
        |> range(start: {time})
        |> filter(fn: (r) => r._measurement == "mqtt_message")
        |> filter(fn: (r) => r.field == "{parameter}")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: false)
        '''
    )

    data = []
    for table in result:
        for record in table.records:
            data.append({
                "time": record.get_time().isoformat(),
                f"{parameter}": record.values.get(f"{parameter}")
            })
    return jsonify(data)




@app.route('/api/data', methods=['GET'])
def home():
    query_api = client.query_api()
    result = query_api.query(
        f'''
        from(bucket:{os.environ.get("INFLUXDB_BUCKET")}) 
        |> range(start: -10m)
        |> filter(fn: (r) => r._measurement == "mqtt_message")
        |> filter(fn: (r) => r._field == "water_temp_f" or
                             r._field == "air_temp_f" or
                             r._field == "humidity" or
                             r._field == "uv" or
                             r._field == "lux")
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: false)
        '''
    )

    data = []
    for table in result:
        for record in table.records:
            data.append({
                "time": record.get_time().isoformat(),
                "water_temp_F": record.values.get("water_temp_F"),
                "air_temp_F": record.values.get("air_temp_F"),
                "humidity": record.values.get("humidity"),
                "uv": record.values.get("uv"),
                "lux": record.values.get("lux")
            })
    
    return jsonify(data)


@app.route('/api/data/<parameter>', methods=['GET'])
def data(parameter):
    time = request.args.get("time")

    return flux_query(time, parameter)