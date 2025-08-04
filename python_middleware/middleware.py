from influxdb_client import InfluxDBClient, Point, WriteOptions
from influxdb_client.client.write_api import SYNCHRONOUS
import paho.mqtt.client as mqtt
import json
import time
import os


MQTT_BROKER = os.environ.get('MQTT_BROKER')
MQTT_PORT   = int(os.environ.get('MQTT_PORT'))
MQTT_TOPIC  = os.environ.get('MQTT_TOPIC')
MQTT_USERNAME = os.environ.get('MQTT_USERNAME')
MQTT_PASSWORD = os.environ.get('MQTT_PASSWORD')

INFLUXDB_URL    = os.environ.get('INFLUXDB_URL')
INFLUXDB_TOKEN  = os.environ.get('INFLUXDB_TOKEN')
INFLUXDB_ORG    = os.environ.get('INFLUXDB_ORG')
INFLUXDB_BUCKET = os.environ.get('INFLUXDB_BUCKET')



def on_connect(client, userdata, flags, reasonCode, properties=None):
    if reasonCode.is_failure:
        print(f'failed to connect {reasonCode}')
    else:
        print("connected to MQTT broker")
        client.subscribe(MQTT_TOPIC)


def on_message(client, userdata, msg):
    print('received')
    payload = msg.payload.decode()

    payload = json.loads(payload)


    point = Point("mqtt_message") \
        .tag("topic", msg.topic) \
        .field("water_temp_F", payload['wt']) \
        .field("air_temp_F", payload['at']) \
        .field("humidity", payload['h']) \
        .field("uv", payload['uv']) \
        .field("lux", payload['l']) \
    
    try:
        userdata["write_api"].write(bucket = INFLUXDB_BUCKET, org = INFLUXDB_ORG, record = point)
    except Exception as e:
        print(f"Failed to write: {e}")


def on_subscribe(client, userdata, mid, reason_code_list, properties):
    if reason_code_list[0].is_failure:
        print(f"Broker rejected subscription")
    else:
        print(f"broker approved subscription")


def main():
    # connect to influxdb
    influx_client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=INFLUXDB_ORG)
    write_api = influx_client.write_api(write_options=SYNCHRONOUS)

    # connect to mqtt broker
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_subscribe = on_subscribe

    client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
    client.user_data_set({"write_api": write_api})
    client.connect(MQTT_BROKER, MQTT_PORT, keepalive = 60)


    client.loop_forever()

    return 0


if __name__ == "__main__":
    main()