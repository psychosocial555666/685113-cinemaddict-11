import moment from "moment";

export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.text = data[`comment`];
    this.date = `${moment(data[`date`]).calendar(null, {sameElse: `YYYY/MM/DD hh:mm`})}`;
    this.smile = data[`emotion`];
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
