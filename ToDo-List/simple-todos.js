Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code runs on client only
  Meteor.subscribe("tasks");

  Template.body.helpers({
    tasks: function() {
      if (Session.get("hideCompleted")) {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }, {
          sort: {
            createdAt: -1
          }
        });
      } else {
        return Tasks.find({}, {
          sort: {
            createdAt: -1
          }
        });
      }
    },
    hideCompleted: function() {
      Session.get("hideCompleted");
    },
    incompleteCount: function() {
      return Tasks.find({
        checked: {
          $ne: true
        }
      }).count();
    }
  });

  Template.body.events({
    "submit .new-task": function(event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a task into the collection
      Meteor.call("addTask", text);

      // Clear form
      event.target.text.value = "";
    },
    "change .hide-completed input": function(event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function() {
      Meteor.call("setChecked", this._id, !this.checked);
    },
    "click .delete": function() {
      Meteor.call("deleteTask", this._id);
    },
    "click .toggle-private": function() {
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.task.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  });
}

Meteor.methods({
  addTask: function(text) {
    // validate user login
    if (!Meteor.user()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      owner: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: new Date() // current time
    });
  },
  deleteTask: function(taskId) {
    var task = Tasks.findOne(taskId);
    if(task.private && task.owner === Meteor.userId()) {
      Tasks.remove(taskId);
    }
    else {
      throw new Meteor.Error("not-authorized");
    }
  },
  setChecked: function(taskId, setChecked) {
    Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },
  setPrivate: function(taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);

    if(task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, {$set : {private: setToPrivate} })
  }
});

if (Meteor.isServer) {
  // Only publish tasks that are public or is the owner
  Meteor.publish("tasks", function() {
    return Tasks.find({
      $or: [
        {private: {$ne : true} },
        {owner: this.userId}
      ]
    });
  });
}
