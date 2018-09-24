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

name = []
for data in db1.find():
    count += 1
    if ( (data['user_screen_name'] != "") and (data['friend_screen_name'] != "") ):
        if ( data['user_screen_name'] not in name ):
            db2.insert_one({"name" : data['user_screen_name']})
            name.append(data['user_screen_name'])
        if ( data['friend_screen_name'] not in name ):
            db2.insert_one({"name" : data['friend_screen_name']})
            name.append(data['friend_screen_name'])
    print(str(count) + " / 49928")