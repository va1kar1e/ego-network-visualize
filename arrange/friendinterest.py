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

count = 0
for main in db4.find():
    for each in db3.find({"name" : main['name']}):
        friendInterest = {}
        for friend in each['friend']:
            for cate in db4.find({"name" : friend}):
                sameInterest = {}
                for i in cate['category']:
                    if (i in main['category']):
                        sameInterest[i] = main['category'][i]
                if(sameInterest != {}):
                    friendInterest[friend] = sameInterest
    # if friendInterest != {}:
    db6.insert_one({"name" : main['name'], "category" : main['category'], "friend" : friendInterest})
    count += 1
    print(str(count) + " / 854")

