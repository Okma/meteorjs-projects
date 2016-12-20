if (Meteor.isClient) {
  Meteor.startup(function() {
    setInterval(function() {

      Session.set("hours", (new Date).getHours());
      Session.set("minutes", (new Date).getMinutes());
      Session.set("seconds", (new Date).getSeconds());

    }, 1000);
  });

  Template.main.helpers({
    hours: function() {
      return Session.get("hours") < 10 ? "0" + Session.get("hours") : Session.get("hours");
    },
    minutes: function() {
      return Session.get("minutes") < 10 ? "0" + Session.get("minutes") : Session.get("minutes");
    },
    seconds: function() {
      return Session.get("seconds") < 10 ? "0" + Session.get("seconds") : Session.get("seconds");
    },
    colorHour: function() {
      return parseInt(Session.get("hours") < 10 ? "0" + Session.get("hours") : "" + Session.get("hours"), 16);
    },
    colorMinute: function() {
      return parseInt(Session.get("minutes") < 10 ? "0" + Session.get("minutes") : "" + Session.get("minutes"), 16);
    },
    colorSecond: function() {
      return parseInt(Session.get("seconds") < 10 ? "0" + Session.get("seconds") : "" + Session.get("seconds"), 16);
    }
  });

}

if (Meteor.isServer) {
}
