var express = require('express');
var router = express.Router();
var request = require("request")
// var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('graph', { title: 'Ego Network' });
});

router.get('/data', function (req, res, next) {
  request({
    url: '../data/friendinterest_split_5.json',
    json: true
  }, function (error, response, body) {
    res.send(body);
    // var process_data = {}
    // var category = [];
    // for (var row_data in data) {
    //   if (data[row_data]['_id'] === user_id) {
    //     category = data[row_data]['category'];
    //   }
    // }

    // var friend = {};
    // for (var row_category in category) {
    //   friend[category[row_category]] = []
    //   for (var row_data in data) {
    //     if (data[row_data]['_id'] !== user_id && data[row_data]['category'].includes(category[row_category])) {
    //       friend[category[row_category]].push(data[row_data]['_id']);
    //     }
    //   }
    // }

    // var nodes = [],
    //   links = [];

    // nodes.push({
    //   id: user_id,
    //   group: 0
    // });

    // var node = []
    // node.push(user_id)

    // var group = Object.keys(friend)

    // for (var row_friend in friend) {
    //   for (var row_infriend in friend[row_friend]) {
    //     if (!node.includes(friend[row_friend][row_infriend])) {
    //       node.push(friend[row_friend][row_infriend])
    //       nodes.push({
    //         id: friend[row_friend][row_infriend],
    //         group: (group.indexOf(row_friend) + 1) / 1
    //       })
    //       links.push({
    //         source: user_id,
    //         target: friend[row_friend][row_infriend]
    //       })
    //     }
    //   }
    // }
    // res.send(process_data);
  });

});

router.get('/graph', function (req, res, next) {
  res.render('graph', { title: 'Ego Network' });
});

module.exports = router;
