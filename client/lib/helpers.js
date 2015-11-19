Template.registerHelper('formatDate', function(datetime, format) {

  var DateFormats = {
         short: 'DD MMMM - YYYY',
         long: 'HH:mm dddd DD.MM.YYYY',
         time: 'HH:mm:ss',
         jslong: 'ddd MMM D YYYY HH:mm:ss zZZ',
         eve: 'YYYY-MM-DD HH:mm:ss'
  };

  if (moment) {
    // can use other formats like 'lll' too
    format = DateFormats[format] || format;
    return moment(datetime).utc().format(format);
  }
  else {
    return datetime;
  }
});
