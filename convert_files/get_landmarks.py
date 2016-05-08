import json
import pprint

with open("../json_files/landmarks.json") as json_data:
    d = json.load(json_data)
    json_data.close()
names = []
out = {"landmarks": []}
for i in d["data"]:
    try:
        name = i[15].encode("utf8")
        if name not in names:
            x = {"location": {"type": "Point", "coordinates": [float(i[8].split()[1].strip("(")), float(i[8].split()[2].strip(")"))]},
                 "name": i[15].encode("utf8"), "address": i[16].encode("utf8")}
            out["landmarks"].append(x)
            names.append(name)
    except:
        pass

f = open("condensed_landmarks.json", "w")
pprint.pprint(out, f)
f.close()
