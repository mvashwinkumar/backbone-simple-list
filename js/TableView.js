var TableView = Backbone.View.extend({
  tagName: 'section',
  id: 'table-view',
  tmpl: _.template(`
    <header>
      <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon" id="basic-addon1">Search</span>
            <input type="text" class="form-control search-input" placeholder="Search" aria-describedby="basic-addon1">
        </div>
      </div>
      <div class="form-group">
          <label for="sort-select">Sort by</label>
          <select class="form-control" id="sort-select">
              <option value="title:asc" <%= isSelected("title:asc") %>>Title : ASC</option>
              <option value="title:desc" <%= isSelected("title:desc") %>>Title : DESC</option>
              <option value="lastModified:asc" <%= isSelected("lastModified:asc") %>>Modified Date : ASC</option>
              <option value="lastModified:desc" <%= isSelected("lastModified:desc") %>>Modified Date : DESC</option>
          </select>
      </div>
    </header>
    <section>
        <ul class="todo-list" id="list-view"></ul>
    </section>
    <footer>Total Number of items : <span class="item-count"><%= size %></span></footer>
  `),

  events: {
    'change select#sort-select': 'onChangeSort',
    'keyup .search-input': 'onSearchTerm',
  },

  initialize: function (itemsCollection, options) {
    this.options = options || {};
    this.views = [];
    this.filteredViews = [];
    this.coll = itemsCollection;
    this.filteredColl = new ItemsCollection();
    this.listenTo(this.coll, 'add', this.addOne);
    this.listenTo(this.coll, 'reset', this.addAll);
    this.listenTo(this.coll, 'sort', this.addAll);
    this.listenTo(this.filteredColl, 'search', this.showFiltered);
    this.listenTo(this.coll, 'all', this.updateItemsCount);
    this.listenTo(this.filteredColl, 'all', this.updateFilteredItemsCount);
    this.render();
    this.$listView = this.$el.find('#list-view');
    // this.onSearchTerm = _.throttle(function(e) {
    //   console.log(e.target.value);
    //   console.log(that);
    // },100);
  },

  render: function () {
    this.$el.append(this.tmpl({ size: this.coll.length, isSelected: this.isSelected.bind(this) }));
    let $appHeader = this.options.$parent.find('header');
    let addItemView = new AddItemView(this.coll);
    $appHeader.append(addItemView.render().el);
    $appHeader.after(this.$el);
  },

  isSelected: function(optVal) {
    let sortOpt = this.coll.sortKey + ':' +((this.coll.sortOrder === 1) ? 'asc' : 'desc');
    return (sortOpt === optVal) ? 'selected' : '';
  },

  onSearchTerm : function(e) {
    let val = e.target.value;
      this.filteredColl.reset(this.coll.filter(function(model) {
        return ((model.get('title').toLowerCase().indexOf(val) != -1) ||
                (model.get('content').toLowerCase().indexOf(val) != -1));
      }));
      this.filteredColl.trigger('search');
  },

  showFiltered: function() {
    let that = this;
    that.filteredViews.forEach(function(view) {
        view.remove();
    });
    that.views.forEach(function(view) {
        view.remove();
    });
    that.$listView.html('');
    that.filteredColl.forEach(function(filteredItem) {
      var view = new ItemView({ model: filteredItem });
      that.$listView.append(view.render().el);
      that.filteredViews.push(view);
    });
  },

  addOne: function (item) {
    var view = new ItemView({ model: item });
    this.$listView.append(view.render().el);
    this.views.push(view);
  },
  addAll: function () {
    this.views.forEach(function(view) {
        view.remove();
    })
    this.$listView.html('');
    this.coll.each(this.addOne, this);
  },
  updateItemsCount: function () {
    this.$el.find('.item-count').html(this.coll.length);
  },
  updateFilteredItemsCount: function () {
    this.$el.find('.item-count').html(this.filteredColl.length);
  },
  onChangeSort: function (e) {
    let selected = e.target.value.split(':');
    this.coll.sortKey = selected[0];
    this.coll.sortOrder = (selected[1] === 'asc') ? 1 : -1;
    this.coll.sort();
  }
});