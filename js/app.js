document.onready = function () {
  var items = new ItemsCollection();
  var tableView = new TableView(items, { $parent: $('#app-view') });
}

