var AddItemView = Backbone.View.extend({
  tagName: 'div',
  id: 'add-item-view',
  tmpl: _.template(` 
    <form>
      <div class="form-group">
        <label class="sr-only" for="new-title">Title</label>
        <input class="form-control" value="New Title" placeholder="Title" id="new-title">
      </div>
      <div class="form-group">
        <label class="sr-only" for="new-content">Content</label>
        <textarea class="form-control" value="New Content" placeholder="Content" id="new-content">New Content</textarea>
      </div>
      <button type="button" class="btn btn-success add-item-btn" aria-label="Add">Add New</button>
    </form>
    <br/>
  `),
  events: {
    'click button': 'onAddItem'
  },

  initialize: function (itemsCollection) {
    this.coll = itemsCollection;
  },

  render: function () {
    this.$el.html(this.tmpl());
    return this;
  },

  onAddItem: function () {
    let item = new ItemModel({
      title: this.$el.find('input').val(),
      content: this.$el.find('textarea').val()
    });

    if (item.isValid()) {
      this.coll.add(item);
      this.$el.find('input').val('');
      this.$el.find('textarea').val('');
    } else {
      alert(item.get("title") + " " + item.validationError);
    }
    
  }
});