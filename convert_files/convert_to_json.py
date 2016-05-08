import json
import xmltodict


def convert(xml_file, xml_attribs=True):
    with open(xml_file, "rb") as f:    # notice the "rb" mode
        d = xmltodict.parse(f, xml_attribs=xml_attribs)
        return json.dumps(d, indent=4)

j = open('eateries.json', 'w')
j.write(str(convert('eateries.xml')))
