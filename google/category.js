module.exports = function(data) {
  const language = require('@google-cloud/language');
  const client = new language.LanguageServiceClient();
  const text = data.full_text
  const user_name = data.user_name
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };  

  var jsonObj = {}
  return client
    .classifyText({document: document})
    .then(results => {
      const classification = results[0];
      jsonObj.user_name = user_name
      jsonObj.full_text = text
      jsonObj.category = {}
      classification.categories.forEach(category => {
        jsonObj.category[category.name] = category.confidence
      });
      return jsonObj;
    })

    .catch(err => {
      // console.error('ERROR:', err);
      return ''

      /*
      //for category-less but want to use data to calculate entity
      jsonObj.user_name = user_name
      jsonObj.full_text = text
      jsonObj.category = {}
      return jsonObj
      */
    });
}