import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDiv } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';
import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
    tasks() {
      const instance = Template.instance();
      if(instance.state.get('hideCompleted')) {
        // filter by completed tasks
        return Tasks.find({ checked: {$ne: true}}, {sort : {createdAt: -1}});
      }

      // else just show all tasks
      return Tasks.find({}, { sort: { createdAt: -1 }});
    },
    incompleteCount() {
      return Tasks.find({ checked: {$ne : true}}).count();
    }
});

Template.body.events({
    'submit .new-task' (event) {

        // prevent page reload
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;

        Meteor.call('tasks.insert', text);

        // Reset the form text
        target.text.value = "";
    },
    'change .hide-completed input'(event, instance) {
      instance.state.set('hideCompleted', event.target.checked);
    }
});
