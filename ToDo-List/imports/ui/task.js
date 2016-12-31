import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import './task.html';

Template.task.events({
  'click .toggle-checked'() {
    Meteor.call('tasks.setChecked', this._id._str, !this.checked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id._str);
  }
});