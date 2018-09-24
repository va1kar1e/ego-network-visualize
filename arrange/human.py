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
    allinterest = {}
    friendinterest = {}
    for sub in db4.find({"name" : {"$ne" : main['name']}}):
        interest = {}
        amount = {}
        for cate in sub['category']:
            if(cate in main['category'] and sub['category'][cate]):
                amount[cate] = sub['category'][cate]
        # interest[sub['name']] = amount
        # friendinterest.append(interest)
        if(amount != {}):
            friendinterest[sub['name']] = amount
    allinterest['name'] = main['name']
    allinterest['category'] = main['category']
    allinterest['interest'] = friendinterest
    db6.insert_one(allinterest)
    count += 1
    print(str(count) + " / 854")

