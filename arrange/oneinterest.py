import pymongo
import pprint
from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db1 = client['egoNetwork']['tweet_data_all_user']
db2 = client['human']['all']
db3 = client['human']['each']
db4 = client['human']['oneinterest']
db5 = client['dataAnalyzedByPython']['dataAnalyzed']
db6 = client['human']['friendinterest']

count = 0
for name in db2.find():
    interest = []
    amount = {}
    for data in db5.find({"user_name" : name['name']}):
        for cate in data['analyzed_data']['category']:
            if cate.split('/')[1] in amount:
                amount[cate.split('/')[1]] += 1
            else:
                amount[cate.split('/')[1]] = 1
    interest.append(amount)
    if(interest != [{}]):
        db4.insert_one({"name" : name['name'], "category" : amount})
    count += 1
    print(str(count) + " / 14951")