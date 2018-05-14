const Moment = require('moment');
const uuid = require('uuid/v4');

class Collection {
  constructor (name) {
    this.name = name;
    this.items = [];
  }

  create (data) {
    data.id = uuid();
    data.createdAt = Moment();
    this.items.push(data);
    return data;
  }

  find (query) {
    if (!query) {
      return this.items;
    }
    return this.items.filter((item)=> {
      return Object.entries(item).every(([attr, value])=> {
        return (item[attr] === value);
      });
    });
  }
}

const Author = new Collection ('authors');
const Post = new Collection ('posts');

module.exports = {
  Author,
  Post
};
