from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import json
import re
from pymongo import MongoClient

#pymongo
client = MongoClient('localhost', 27017)
db = client['dataAnalyzedByPython']

def filter_text(full_text):
    text = ""
    list_text_split = full_text.split(' ')
    for text_split in list_text_split:
        text_split = text_split.replace('\n', '')
        text_split = text_split.replace('.', '')
        text_split = re.sub(r'^https?:\/\/.*[\r\n]*', '', text_split)
        text_split = re.sub(r'^@.*[\r\n]*', '', text_split)
        text += (text_split + ' ')
    return text

def analyzed_google_api(data):
    client = language.LanguageServiceClient()
    text = filter_text(data['full_text'])
    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    jsonObj = {}
    jsonObj['entity'] = {}
    jsonObj['category'] = {}

    #entity
    try:
        entities = client.analyze_entities(document).entities
    except:
        return jsonObj #error when texts are not 'en'
    for entity in entities:
        jsonObj['entity'][entity.name] = entity.salience

    #category
    try:
        categories = client.classify_text(document).categories
    except:
        return jsonObj
    for category in categories:
        jsonObj['category'][category.name] = category.confidence
    return jsonObj

#main
count = 0
lines = [line.rstrip('\n') for line in open('data_for_python.json')]
for data in lines:
    data = json.loads(data)
    jsonObj = {}
    jsonObj['analyzed_data'] = analyzed_google_api(data)
    jsonObj['full_text'] = data['full_text']
    jsonObj['user_name'] = data['user_screen_name']
    count += 1
    try:
        db['dataAnalyzed'].insert_one(jsonObj)
        print(str(count) + " process(es) is done.")
    except:
        print(str(count) + " process(es) is error.")
print("finish!")






