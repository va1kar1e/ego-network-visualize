var express = require('express');
var router = express.Router();
var request = require("request")
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('graph', {
    title: 'Ego Network'
  });
});

router.get('/data/:file/:username', function (req, res, next) {
  var dir_path = path.join(path.dirname(__dirname), 'public'),
    file_path = path.join(dir_path, 'data/' + req.params.file + '.json'),
    obj = [];

  try {
    obj = JSON.parse(fs.readFileSync(file_path, 'utf8'));
  } catch (e) {
    res.status(404).json({
      code: 404,
      error: 'Not found'
    });
  }

  var user_find = {
      nodes: [],
      links: [],
      category: {}
    },
    user_name = req.params.username;

  for (var row_data in obj) {
    if (obj[row_data]['name'] === user_name) {

      // res.send(obj[row_data])
      var friends = obj[row_data]['friend'],
          key_friend = Object.keys(friends);
      user_find['friends'] = key_friend;
      user_find['name'] = obj[row_data]['name'];

      var max_u_find = [0, ""];
      Object.keys(obj[row_data]['category']).forEach(function (value) {
        if (max_u_find[0] < obj[row_data]['category'][value]) {
          max_u_find[0] = obj[row_data]['category'][value];
          max_u_find[1] = value;
        }
        user_find['category'][value] = 1;
      });

      user_find['nodes'].push({
        id: 1,
        name: user_name,
        category: obj[row_data]['category'],
        group: max_u_find[1]
      })

      key_friend.forEach(function (value, index) {
         var color_lines = friends[value],
            color_links = Object.keys(color_lines),
            max_val = [0, ""];

        color_links.forEach(function (friend_cat) {
          user_find['category'][friend_cat] += 1;
          var g_dat = color_lines[friend_cat];
          if (max_val[0] < g_dat && Object.keys(user_find['category']).includes(friend_cat)) {
            max_val[0] = g_dat
            max_val[1] = friend_cat
          }
        });
        
        user_find['nodes'].push({
          id: index + 2,
          name: value,
          category: friends[value],
          group: max_val[1]
        })

        user_find['links'].push({
          source: user_name,
          target: value,
          group: max_val[1]
        })

      });
      break;
    }
  }

  res.send(user_find)
});

module.exports = router;
