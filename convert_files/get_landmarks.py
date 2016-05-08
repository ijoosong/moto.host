import json
import pprint

with open('../json_files/landmarks.json') as json_data:
    d = json.load(json_data)
    json_data.close()

out = {'buildings':[]}
for i in d['data']:
    try:
        x = [[i[8].split()[1].strip('(').encode('utf8'), i[8].split()[2].strip(')').encode('utf8')],
             i[15].encode('utf8'), i[16].encode('utf8')]
        out['buildings'].append(x)

    except:
        pass

f = open('condensed_landmarks.json', 'w')
pprint.pprint(out, f)
f.close()