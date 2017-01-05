var ItemsCollection = Backbone.Collection.extend({
  model: ItemModel,
  initialize: function() {
    this.sortKey = 'lastModified';
    this.sortOrder = -1;
  },
  comparator : function(item1, item2) {
    let i1 = item1.get(this.sortKey),
        i2 = item2.get(this.sortKey),
        ret = (i1 === i2) ? 0 : ((i1 < i2) ? -1 : 1);
    return (this.sortOrder === -1) ? (-1)*ret : ret;
  }
});