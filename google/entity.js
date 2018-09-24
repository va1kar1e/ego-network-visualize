module.exports = function(data) {
  const language = require('@google-cloud/language');
  const client = new language.LanguageServiceClient();
  const text = data.full_text
  const user_name = data.user_name
  const category = data.category
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  var jsonObj = {}
  return client
    .analyzeEntities({document: document})
    .then(results => {
      const entities = results[0].entities;
      jsonObj.user_name = user_name
      // jsonObj.full_text = text
      jsonObj.category = category
      jsonObj.entity = {}
      entities.forEach(entity => {
        if (!entity.name.match(/^https?:\/\//)){
          jsonObj.entity[entity.name.replace(/\./g, ' ')] = entity.salience
        }
      });
      return jsonObj;
    })
    .catch(err => {
      // console.error('ERROR:', err);
      return '';
    });
}