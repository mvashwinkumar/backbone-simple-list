var ItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group view',
  tmpl: _.template(`    
    <div class="list-group-item view">
      <div class="thumbnail">
        <div class="caption">
          <h4 class="list-group-item-heading title"><%= title %></h4>
          <h6 class="list-group-item-heading">Last Modified Date on <%= new Date(lastModified).toString() %></h6>
          <p class="list-group-item-text content"><%= content %></p>
          <br/>
          <p><button type="button" class="btn btn-danger delete">Delete</button></p>
        </div>
      </div>
    </div>
    <div class="list-group-item edit">

    <form>
      <div class="form-group">
        <label class="sr-only" for="edit-title">Title</label>
        <input class="form-control edit title" value="<%= title %>" placeholder="Title" id="edit-title">
      </div>
      <div class="form-group">
        <label class="sr-only" for="edit-content">Content</label>
        <textarea class="form-control edit content"placeholder="Content" id="edit-content"><%= content %></textarea>
      </div>
      <div class="form-group">
        <button type="button" class="btn btn-success save">Save</button>
        <button type="button" class="btn btn-default cancel">Cancel</button>
      </div>
    </form>
    </div>      
  `),
  events: {
    'dblclick .list-group-item.view': 'edit',
    'click button.delete': 'onDeleteItem',
    'click button.save': 'onSave',
    'click button.cancel': 'onCancel'
  },
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function () {
    this.$el.html(this.tmpl(this.model.attributes));
    this.$viewTitle = this.$el.find('.view .title');
    this.$viewContent  = this.$el.find('.view .content');
    this.$viewDelete = this.$el.find('.view .delete');
    this.$editTitle = this.$el.find('.edit .title');
    this.$editContent = this.$el.find('.edit .content');
    this.$editSave = this.$el.find('.edit .save');
    return this;
  },

  edit: function () {
    this.$el.addClass('edit');
    this.$el.removeClass('view');
    this.$el.find('input').focus();
  },

  onSave: function () {
    
    this.model.set({
      'title' : this.$editTitle.val(),
      'content' : this.$editContent.val(),
      'lastModified' : new Date().getTime()
    });
    if(this.model.isValid()) {
      this.$el.addClass('view');
      this.$el.removeClass('edit');
      $('#table-view').find('.search-input').val('');
      this.model.collection.sort();
    } else {
      alert(this.model.get("title") + " " + this.model.validationError);
    }
    
  },

  onCancel: function() {
    this.$el.addClass('view');
    this.$el.removeClass('edit');
    this.render();
  },

  onDeleteItem: function (e) {
    this.model.destroy();
    this.remove();
  }
});