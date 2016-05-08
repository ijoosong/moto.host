from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_restful import Api, Resource


app = Flask(__name__)
app.config["MONGO_DBNAME"] = "moto"
mongo = PyMongo(app, config_prefix='MONGO')
APP_URL = "http://127.0.0.1:5000"

from util import ListConverter

app.url_map.converters['list'] = ListConverter


class Landmarks(Resource):
    def get(self, gps=[], name=None):
        if gps:
            landmark = mongo.db.landmarks.find_one({"location":{"$near":{"$geometry":{
                "type":"Point","coordinates":[float(gps[0]),float(gps[1])]},"$maxDistance":10000000}}})
            return jsonify({"location": landmark["location"],
                            "name": landmark["name"],
                            "address": landmark["address"]})
        elif name:
            landmark = mongo.db.landmarks.find_one({"name": {"$regex":  name}})
            return jsonify({"location": landmark["location"],
                            "name": landmark["name"],
                            "address": landmark["address"]})
        else:
            return jsonify({"result": "error, need name or gps"})


class Eateries(Resource):
    def get(self, name=None):
        print name
        if name:
            eatery = mongo.db.eateries.find_one({"name": {"$regex": name}})
            return jsonify({"name": eatery["name"],
                            "location": eatery["location"]})
        else:
            return jsonify({"result": "error, need name"})


class Index(Resource):
    def get(self):
        return jsonify({"result": "you're at the index"})


api = Api(app)
api.add_resource(Index, "/", endpoint="index")
api.add_resource(Landmarks, "/api/landmarks", endpoint="landmarks")
api.add_resource(Landmarks, "/api/landmarks/<list:gps>", endpoint="gps")
api.add_resource(Landmarks, "/api/landmarks/name/<string:name>", endpoint="lname")
api.add_resource(Eateries, "/api/eateries/<string:name>", endpoint="ename")

if __name__ == "__main__":
    app.run(debug=True)
