const _ = require('lodash');

class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(user => user.id !== id);
    }

    return user;
  }
  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }
  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
  isNameAvailable(name, room) {
    return !this.users.some(user => (user.name === name && user.room === room));
  }
  getRoomList() {
    var rooms = this.users.map(user => user.room);
    return _.uniq(rooms);
  }
}

module.exports = {Users};
