var express = require('express');
var router = express.Router();
var request = require("request")
var path = require('path');
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('graph', { title: 'Ego Network' });
});

router.get('/data/:file/:username', function (req, res, next) {
  var dir_path = path.join(path.dirname(__dirname), 'public'),
      file_path = path.join(dir_path, 'data/' + req.params.file + '.json'),
      obj = [];

  try {
    obj = JSON.parse(fs.readFileSync(file_path, 'utf8'));
  } catch(e) {
    res.status(404).json({ code: 404, error: 'Not found' });
  }

  var user_find = {
        nodes: [],
        links: []
      },
      user_name = req.params.username;

  for (var row_data in obj) {
    if (obj[row_data]['name'] === user_name) {
      var friends = Object.keys(obj[row_data]['friend']);
      user_find['name'] = obj[row_data]['name'];
      user_find['category'] = Object.keys(obj[row_data]['category']);
      user_find['friends'] = friends;

      var max_u_find = [0,""];
      Object.keys(obj[row_data]['category']).forEach( function(value) {
        if (max_u_find[0] < obj[row_data]['category'][value]) {
          max_u_find[0] = obj[row_data]['category'][value];
          max_u_find[1] = value;
        }
      });

      user_find['nodes'].push({
        id : 1,
        name : obj[row_data]['name'],
        category: obj[row_data]['category'],
        group: max_u_find[1]
      })
      for (var friend in friends) {
        var color_lines = obj[row_data]['friend'][friends[friend]],
          color_links = Object.keys(color_lines), max_val = [0, ""];

        for (var color_link in color_links) {
          var g_name = color_links[color_link],
              g_dat = color_lines[g_name];
          if (max_val[0] < g_dat && user_find['category'].includes(g_name)) {
            max_val[0] = g_dat
            max_val[1] = g_name
          }
        }
        user_find['nodes'].push({
          id: parseInt(friend)+2,
          name: friends[friend],
          category: obj[row_data]['friend'][friends[friend]],
          group: max_val[1]
        })

        user_find['links'].push({
          source: obj[row_data]['name'],
          target: friends[friend],
          group: max_val[1]
        })
      }
      break;
    }
  }

  // for (var friend in user_find['friends']) {
  //   for (var row_data in obj) {
  //     if (obj[row_data]['name'] === user_find['friends'][friend]) {
  //       var friend_sub_1 = Object.keys(obj[row_data]['friend']);

  //       for (var friend_sub_2 in user_find['friends']) {
  //         if (friend_sub_1.includes(user_find['friends'][friend_sub_2])) {
  //           var color_lines = obj[row_data]['friend'][user_find['friends'][friend_sub_2]],
  //               color_links = Object.keys(color_lines), max_val = [0, ""];

  //           for (var color_link in color_links) {
  //             var g_name = color_links[color_link],
  //                 g_dat = color_lines[g_name];
  //             if (max_val[0] < g_dat && user_find['category'].includes(g_name)) {
  //               max_val[0] = g_dat
  //               max_val[1] = g_name
  //             }
  //           }

  //           user_find['links'].push({
  //             source: obj[row_data]['name'],
  //             target: user_find['friends'][friend_sub_2],
  //             group: max_val[1]
  //           })
  //         }
  //       }
  //       break;
  //     }
  //   }
  // }

  res.send(user_find)
});

module.exports = router;
