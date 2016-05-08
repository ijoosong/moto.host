from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_restful import Api, Resource
import urllib2
import json

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
            url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1" \
                  "&explaintext&exintro&titles="+'_'.join(landmark['name'].split(' '))+"&redirects=&formatversion=2"
            response = urllib2.urlopen(url)
            data = json.load(response)
            out = None
            extract = data['query']['pages']
            print extract[0]['extract']
            try:
                extract = data['query']['pages'][0]['extract']
                out = extract.split('.')[0::3]
                x = []
                for l in out:
                    l = l + '. '
                    x.append(l.replace("\n", " "))
                out = ''.join(x)
                out = remove_text_inside_brackets(out)
            except:
                pass
            if out:
                return jsonify({"location": landmark["location"],
                                "name": landmark["name"],
                                "address": landmark["address"],
                                "excerpt": out})

            return jsonify({"location": landmark["location"],
                            "name": landmark["name"],
                            "address": landmark["address"],
                            "excerpt": extract})
        elif name:
            landmark = mongo.db.landmarks.find_one({"name": {"$regex":  name}})

            url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1" \
                  "&explaintext&exintro&titles="+'_'.join(landmark['name'].split(' '))+"&redirects=&formatversion=2"
            response = urllib2.urlopen(url)
            data = json.load(response)
            out = None
            extract = data['query']['pages']
            try:
                extract = data['query']['pages'][0]['extract']
                out = extract.split('.')[0::3]
                x = []
                for l in out:
                    l = l + '. '
                    x.append(l.replace("\n", " "))
                out = ''.join(x)
                out = remove_text_inside_brackets(out)
            except:
                pass
            if out:
                return jsonify({"location": landmark["location"],
                                "name": landmark["name"],
                                "address": landmark["address"],
                                "excerpt": out})

            return jsonify({"location": landmark["location"],
                            "name": landmark["name"],
                            "address": landmark["address"],
                            "excerpt": extract})
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


class Excerpt(Resource):
    def get(self, search=None):
        print search
        url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1" \
              "&explaintext&exintro&titles="+search+"&redirects=&formatversion=2"
        response = urllib2.urlopen(url)
        data = json.load(response)
        extract = data['query']['pages'][0]['extract']
        out = extract.split('.')[0::4]
        x = []
        for l in out:
            l = l + '. '
            x.append(l.replace("\n", " "))
        out = ''.join(x)
        out = remove_text_inside_brackets(out)
        return jsonify({"result": out})


def remove_text_inside_brackets(t, brackets="()[]"):
    count = [0] * (len(brackets) // 2) # count open/close brackets
    saved_chars = []
    for character in t:
        for i, b in enumerate(brackets):
            if character == b: # found bracket
                kind, is_close = divmod(i, 2)
                count[kind] += (-1)**is_close # `+1`: open, `-1`: close
                if count[kind] < 0: # unbalanced bracket
                    count[kind] = 0
                break
        else: # character is not a bracket
            if not any(count): # outside brackets
                saved_chars.append(character)
    return ''.join(saved_chars)


api = Api(app)
api.add_resource(Index, "/", endpoint="index")
api.add_resource(Landmarks, "/api/landmarks", endpoint="landmarks")
api.add_resource(Landmarks, "/api/landmarks/<list:gps>", endpoint="gps")
api.add_resource(Landmarks, "/api/landmarks/name/<string:name>", endpoint="name")
api.add_resource(Eateries, "/api/eateries/<string:name>", endpoint="ename")
api.add_resource(Excerpt, "/api/excerpt/<string:search>", endpoint="search")

if __name__ == "__main__":
    app.run(debug=True)
