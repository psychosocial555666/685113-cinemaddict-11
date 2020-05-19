
export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.text = data[`comment`];
    this.date = data[`date`];
    this.smile = data[`emotion`];
  }

  toRAW() {
    return {
      "comment": this.text,
      "date": this.date,
      "emotion": this.smile
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comment) {
    return comment.map(Comment.parseComment);
  }

  static clone(comment) {
    return new Comment(comment);
  }
}
