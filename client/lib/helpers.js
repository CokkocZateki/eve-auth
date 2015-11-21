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

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-bottom-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "400",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};
