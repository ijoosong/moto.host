from flask import Flask, jsonify, url_for, redirect
from flask_pymongo import PyMongo
from flask_restful import Api, Resource


app = Flask(__name__)
app.config["MONGO_DBNAME"] = "moto"
mongo = PyMongo(app, config_prefix='MONGO')
APP_URL = "http://127.0.0.1:5000"

from util import ListConverter

app.url_map.converters['list'] = ListConverter

# mongo.db.landmarks.find({"location":{$near:{$geometry:{type:"Point",coordinates:[-73.9667,40.781]},$maxDistance:400}}})


class Landmarks(Resource):
    def get(self, gps=[], name=None):
        print name
        print gps
        if gps:
            landmark = mongo.db.landmarks.find_one({"location":{"$near":{"$geometry":{
                "type":"Point","coordinates":[float(gps[0]),float(gps[1])]},"$maxDistance":1000000}}})
            return jsonify({"location": landmark["location"],
                            "name": landmark["name"],
                            "address": landmark["address"]})
        elif name:
            landmark = mongo.db.landmarks.find_one({"name": {"$regex":  name}})
            return jsonify({"location": landmark["location"],
                            "name": landmark["name"],
                            "address": landmark["address"]})

class Index(Resource):
    def get(self):
        return redirect(url_for("landmarks"))


api = Api(app)
api.add_resource(Index, "/", endpoint="index")
api.add_resource(Landmarks, "/api", endpoint="landmarks")
api.add_resource(Landmarks, "/api/<list:gps>", endpoint="gps")
api.add_resource(Landmarks, "/api/name/<string:name>", endpoint="name")

if __name__ == "__main__":
    app.run(debug=True)
