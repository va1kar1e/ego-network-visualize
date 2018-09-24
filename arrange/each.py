import pymongo
import pprint
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db1 = client['egoNetwork']['tweet_data_all_user']
db2 = client['human']['all'] # 1
db3 = client['human']['each']
db4 = client['human']['oneinterest']
db5 = client['dataAnalyzedByPython']['dataAnalyzed']
db6 = client['human']['friendinterest']

for name in db2.find():
    friend = []

    for data in db1.find({"user_screen_name" : name['name']}):
        if ( ( data['friend_screen_name'] != "" ) and data['friend_screen_name'] not in friend):
            friend.append(data['friend_screen_name'])
    
    for data in db1.find({"friend_screen_name" : name['name']}):
        if ( ( data['user_screen_name'] != "" ) and data['user_screen_name'] not in friend):
            friend.append(data['user_screen_name'])

    db3.insert_one({"name" : name['name'], "friend" : friend})
    count += 1
    print(str(count) + " / 14951")