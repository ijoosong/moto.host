import json
import pprint

with open('../json_files/landmarks.json') as json_data:
    d = json.load(json_data)
    json_data.close()

out = {'buildings':[]}
for i in d['data']:
    try:
        x = [[i[8].split()[1].strip('('), i[8].split()[2].strip(')')], i[15], i[16]]
        out['buildings'].append(x)

    except:
        pass

f = open('condensed_landmarks.json', 'w')
pprint.pprint(out, f)
f.close()