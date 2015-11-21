Meteor.myFunctions = {
  /**
    * @desc description
    * @param string $value - what it is
    * @return bool - success or failure
  */
  notifyTimer: function(timer) {
    var date = new Date();
    Alerts.remove({});
    Alerts.insert({
      title: 'AUTH TIMER ALERT',
      message: timer.name,
      created: date,
      modified: date
    });
    return true;
  }
};


/*Eveonlinejs.fetch('eve:CharacterAffiliation', {ids: 132836877}, function (err, result) {
  if (err) throw err

  console.log(result);
  console.log(result.characters['132836877'].allianceID);
});*/
