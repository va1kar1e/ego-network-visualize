import tweepy
import time
auth1 = tweepy.OAuthHandler("", "")
auth1.set_access_token("", "")

auth2 = tweepy.OAuthHandler("", "")
auth2.set_access_token("", "")

auth3 = tweepy.OAuthHandler("", "")
auth3.set_access_token("", "")

#auth1 12:37
#auth2
#auth3
api = tweepy.API(auth3)
while True:
    # get keywords
    keyword_list = []
    with open('keyword_queue.txt', encoding="utf8") as f:
        keyword_list = f.readlines()
    keyword_list = [word.replace('\n', '') for word in keyword_list]
    if len(keyword_list) == 0:
        print('There is no keyword.')
        sys.exit(0)

    used_keyword_list = []
    with open('used_keywords.txt', encoding="utf8") as f:
        used_keyword_list = f.readlines()
    used_keyword_list = [word.replace('\n', '') for word in used_keyword_list]
    keyword = keyword_list[0]
    print(f'Keyword: {keyword}')
    new_keyword_list = []
    tweet_count = 0
    entities = {}
    tweets = api.followers(screen_name=keyword, lang='en', count=50)
    
    for tweet in tweets:
        new_keyword_list.append(str(tweet._json['screen_name']))

    with open('keyword_queue.txt', encoding="utf8") as f:
        keyword_list = f.readlines()
    keyword_list = [word.replace('\n', '') for word in keyword_list]

    for i in new_keyword_list :
        keyword_list.append(i)
    keyword_list = keyword_list[1:]
    with open('keyword_queue.txt', 'w', encoding="utf8") as f:
        data = '\n'.join(keyword_list)
        f.write(data)
    
    with open('used_keywords.txt', 'a', encoding="utf8") as f:
        f.write(f"{keyword}\n")
    
    with open('keyword_friend.txt', 'a', encoding="utf8") as f:
        f.write(f'"{keyword}" : {new_keyword_list}\n')

    print(f"{'='*10}")
