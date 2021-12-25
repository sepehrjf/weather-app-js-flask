from flask import Flask, url_for, jsonify, request
import requests
import json

app = Flask(__name__, static_url_path='')


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/<lat>/<lng>')
def index(lat, lng):
    loc = lat + "," + lng
    url = "https://api.tomorrow.io/v4/timelines"
    querystring = {"location": loc, "fields": ["temperature", "temperatureApparent", "temperatureMax", "temperatureMin", "windSpeed", "windDirection", "humidity", "pressureSeaLevel", "uvIndex", "weatherCode", "precipitationProbability", "precipitationType",
                                               "sunriseTime", "sunsetTime", "visibility", "moonPhase", "cloudCover"], "units": "imperial", "timesteps": ["1h", "1d", "current"], "timezone": "America/Los_Angeles", "apikey": "ZrSy0YQ3ra9PTjZoG2KKXe3uvpAvFIPH"}
    headers = {"Accept": "application/json"}
    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    return response.json()


if __name__ == '__main__':
    app.run(debug=True)
