var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('data.json')
});

const Entity = require('./entity.js')
const Category = require('./category.js')
var lines = []
var data = {}
var promises = []
const db = require('monk')('localhost/analyzedEgonetwork')
var count=0
lineReader.on('line', function (line) {
  	data['user_name'] = JSON.parse(line).user_name
  	data['full_text'] = JSON.parse(line).full_text

    promises.push(new Promise(resolve => {
      Category(data).then((result_category) => {
        if (result_category !== ''){
          Entity(result_category).then(function(result_entity) {
            db.get('analyzedTweet').insert(result_entity).then(function() {
              resolve()
            }).catch(err => {
              // console.log(err)
            })
          })
        }else{
          resolve()
        }
      })
    }).then(function() {
      count++;
      console.log(count + ' process(es) done.')
    }))

})

lineReader.on('close', function() {
  console.log(promises.length + ' promises in queue.')
  Promise.all(promises).then(function() {
    console.log('finish!')
    db.close()
  })
})
