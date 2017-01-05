var ItemModel = Backbone.Model.extend({
  defaults: {
    title: 'New Title',
    content: 'New Content',
    lastModified: new Date().getTime()
  },
  initialize: function() {
    this.validate(this.attributes, {'validate': true});
    this.set('lastModified',new Date().getTime());
  },
  validate: function(attrs) {
    if (!attrs.title || attrs.title.length === 0) {
      return "Title cannot be empty";
    }
  }
});