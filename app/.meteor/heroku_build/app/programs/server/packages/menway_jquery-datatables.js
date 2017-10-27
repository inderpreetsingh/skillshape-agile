(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ComponentMixins = Package['menway:luma-component'].ComponentMixins;
var Component = Package['menway:luma-component'].Component;

/* Package-scope variables */
var __coffeescriptShare, DataTableMixins, DataTableComponent;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/menway_jquery-datatables/packages/menway_jquery-datatables.js                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/mixins/Base.mixin.coffee.js                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/*
  ```coffeescript
    class Whatever extends Component
      @extend DataTableMixins.Base
  ```
 */

/*
  ```coffeescript
    class Whatever extends Component
      @extend DataTableMixins.Base
      constructor: ( context = {} ) ->
        @data.instanceProperty = @instanceProperty
        super
  ```
 */
                    

DataTableMixins = {
  Base: {
    extended: function() {
      if (Meteor.isServer) {
        this.include({
          defaults: {}
        });
      }
      if (Meteor.isClient) {
        return this.include({
          defaults: {
            destroy: true,
            jQueryUI: false,
            autoWidth: true,
            deferRender: false,
            scrollCollapse: false,
            paginationType: "full_numbers",
            dom: "<\"datatable-header\"fl><\"datatable-scroll\"rt><\"datatable-footer\"ip>",
            language: {
              search: "_INPUT_",
              lengthMenu: "<span>Show :</span> _MENU_",
              processing: "Loading",
              paginate: {
                first: "First",
                last: "Last",
                next: ">",
                previous: "<"
              }
            }
          },
          prepareOptions: function() {
            if (!this.options) {
              this.data.options = {};
              this.addGetterSetter("data", "options");
            }
            this.options().component = this;
            if (!this.isDomSource()) {
              this.options().data = this.rows();
              this.options().columns = this.columns ? this.columns() : [];
              if (this.collection && this.query) {
                this.options().serverSide = true;
                this.options().processing = true;
                this.options().ajaxSource = "useful?";
                this.options().serverData = _.debounce(_.bind(this.fnServerData, this), 300);
              }
            }
            return this.options(_.defaults(this.options(), this.defaults));
          },
          initializeDisplayLength: function() {
            if ($().select2 && $("" + (this.selector()) + " .dataTables_length select")) {
              return $("" + (this.selector()) + " .dataTables_length select").select2({
                minimumResultsForSearch: "-1"
              });
            }
          },
          initializeFilterPlaceholder: function() {
            if ($("" + (this.selector()) + " .dataTables_filter input[type=text]")) {
              return $("" + (this.selector()) + " .dataTables_filter input[type=text]").attr("placeholder", "Type to filter...");
            }
          },
          initializeFooterFilter: function() {
            var self;
            if ($.keyup && $("." + (this.selector()) + " .dataTables_wrapper tfoot input")) {
              self = this;
              return $("." + (this.selector()) + " .dataTables_wrapper tfoot input").keyup(function() {
                var target;
                target = this;
                return self.getDataTable().fnFilter(target.value, $("." + (self.getSelector()) + " .dataTables_wrapper tfoot input").index(target));
              });
            }
          },
          isDomSource: function() {
            if (this.dom) {
              return this.dom();
            } else {
              return false;
            }
          }
        });
      }
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/mixins/Collection.mixin.coffee.js                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
DataTableMixins.Collection = {
  countCollection: Meteor.isClient ? new Meteor.Collection("datatable_count") : "datatable_count",
  collections: [],
  getCollection: function(string) {
    var collection, id, _ref;
    _ref = DataTableComponent.collections;
    for (id in _ref) {
      collection = _ref[id];
      if (collection instanceof Meteor.Collection) {
        if (collection._name === string) {
          return collection;
          break;
        }
      }
    }
    return void 0;
  },
  extended: function() {
    this.include({
      prepareCollection: function() {
        var collection;
        if (Meteor.isClient) {
          if (this.subscription) {
            collection = DataTableComponent.getCollection(this.id());
            this.log("collection", collection);
            if (collection) {
              this.data.collection = collection;
              this.log("collection:exists", collection);
            } else {
              this.data.collection = new Meteor.Collection(this.id());
              DataTableComponent.collections.push(this.data.collection);
              this.log("collection:created", this.data.collection);
            }
            this.addGetterSetter("data", "collection");
          }
        }
        if (Meteor.isServer) {
          if (!this.data.collection) {
            throw new Error("collection property is not defined");
          }
          return this.addGetterSetter("data", "collection");
        }
      },
      collectionName: function() {
        if (this.collection) {
          return this.collection()._name;
        } else {
          return false;
        }
      },
      prepareCountCollection: function() {
        if (this.subscription) {
          if (!this.countCollection) {
            this.data.countCollection = DataTableComponent.countCollection;
            return this.addGetterSetter("data", "countCollection");
          }
        }
      }
    });
    if (Meteor.isClient) {
      return this.include({
        getCount: function(collectionName) {
          var countDoc;
          if (this.subscription) {
            countDoc = this.countCollection().findOne(collectionName);
            if (countDoc && "count" in countDoc) {
              return countDoc.count;
            } else {
              return 0;
            }
          }
        },
        totalCount: function() {
          return this.getCount(this.collectionName());
        },
        filteredCount: function() {
          return this.getCount("" + (this.collectionName()) + "_filtered");
        }
      });
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/mixins/Columns.mixin.coffee.js                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
DataTableMixins.Columns = {
  extended: function() {
    if (Meteor.isClient) {
      return this.include({
        prepareColumns: function() {
          var column, columns, _i, _len;
          if (!this.columns) {
            this.data.columns = void 0;
            this.addGetterSetter("data", "columns");
          }
          columns = this.columns() || [];
          for (_i = 0, _len = columns.length; _i < _len; _i++) {
            column = columns[_i];
            this.setDefaultCellValue(column);
          }
          return this.columns(columns);
        },
        setDefaultCellValue: function(column) {
          Match.test(column.data, String);
          Match.test(column.title, String);
          if (!column.mRender) {
            return column.mRender = function(data, type, row) {
              var _name;
              return row[_name = column.data] != null ? row[_name] : row[_name] = "";
            };
          }
        }
      });
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/mixins/Publish.mixin.coffee.js                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
DataTableMixins.Publish = {
  extended: function() {
    if (Meteor.isServer) {
      return this.include({
        updateCount: function(args, added) {
          var component, filtered, total;
          if (added == null) {
            added = false;
          }
          component = this;
          if (args.initialized) {
            total = component.collection().find(args.baseQuery).count();
            component.log("" + (component.subscription()) + ":count:total", total);
            filtered = component.collection().find(args.filteredQuery).count();
            component.log("" + (component.subscription()) + ":count:filtered", filtered);
            if (added) {
              args.publish.added(component.countCollection(), args.collectionName, {
                count: total
              });
              return args.publish.added(component.countCollection(), "" + args.collectionName + "_filtered", {
                count: filtered
              });
            } else {
              args.publish.changed(component.countCollection(), args.collectionName, {
                count: total
              });
              return args.publish.changed(component.countCollection(), "" + args.collectionName + "_filtered", {
                count: filtered
              });
            }
          }
        },
        observer: function(args) {
          var component;
          component = this;
          return this.collection().find(args.filteredQuery, args.options).observe({
            addedAt: function(doc, index, before) {
              component.updateCount(args);
              args.publish.added(args.collectionName, doc._id, doc);
              args.publish.added(component.collection()._name, doc._id, doc);
              return component.log("" + (component.subscription()) + ":added", doc._id);
            },
            changedAt: function(newDoc, oldDoc, index) {
              component.updateCount(args);
              args.publish.changed(args.collectionName, newDoc._id, newDoc);
              args.publish.changed(component.collection()._name, newDoc._id, newDoc);
              return component.log("" + (component.subscription()) + ":changed", newDoc._id);
            },
            removedAt: function(doc, index) {
              component.updateCount(args);
              args.publish.removed(args.collectionName, doc._id);
              args.publish.removed(component.collection()._name, doc._id);
              return component.log("" + (component.subscription()) + ":removed", doc._id);
            }
          });
        },
        publish: function() {
          var component;
          component = this;
          return Meteor.publish(component.subscription(), function(collectionName, baseQuery, filteredQuery, options) {
            var args, countArgs, countHandle, handle, lastPage, query, queryMethod;
            Match.test(baseQuery, Object);
            Match.test(filteredQuery, Object);
            Match.test(options, Object);
            component.log("" + (component.subscription()) + ":query:base", baseQuery);
            component.log("" + (component.subscription()) + ":query:filtered", filteredQuery);
            component.log("" + (component.subscription()) + ":options", options);
            if (_.isFunction(component.query())) {
              queryMethod = _.bind(component.query(), this);
              query = queryMethod(component);
            } else {
              query = component.query();
            }
            baseQuery = {
              $and: [query, baseQuery]
            };
            filteredQuery = {
              $and: [query, baseQuery]
            };
            args = {
              publish: this,
              initialized: false,
              collectionName: collectionName,
              baseQuery: baseQuery,
              filteredQuery: filteredQuery,
              options: options
            };
            handle = component.observer(args);
            args.initialized = true;
            component.updateCount(args, true);
            args.publish.ready();
            lastPage = component.collection().find(args.filteredQuery).count() - args.options.limit;
            if (lastPage > 0) {
              countArgs = _.clone(args);
              countArgs.initialized = false;
              countArgs.options.skip = lastPage;
              countHandle = component.collection().find(countArgs.filteredQuery, countArgs.options).observe({
                addedAt: function() {
                  return component.updateCount(countArgs);
                },
                changedAt: function() {
                  return component.updateCount(countArgs);
                },
                removedAt: function() {
                  return component.updateCount(countArgs);
                }
              });
              countArgs.initialized = true;
            }
            return args.publish.onStop(function() {
              handle.stop();
              if (countHandle) {
                return countHandle.stop();
              }
            });
          });
        }
      });
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/mixins/Query.mixin.coffee.js                                            //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
DataTableMixins.Query = {
  extended: function() {
    this.include({
      prepareQuery: function() {
        if (this.subscription || Meteor.isServer) {
          if (!this.query) {
            this.data.query = {};
            return this.addGetterSetter("data", "query");
          }
        }
      }
    });
    if (Meteor.isClient) {
      return this.include({
        arrayToDictionary: function(array, key) {
          var dict, obj, _i, _len;
          dict = {};
          for (_i = 0, _len = array.length; _i < _len; _i++) {
            obj = array[_i];
            if (obj[key] != null) {
              dict[obj[key]] = obj;
            }
          }
          return dict;
        },
        setQuery: function(query) {
          if (this.subscription) {
            if (!this.query) {
              this.prepareQuery();
            }
            if (true) {
              this.query(query);
              return this.rendered();
            }
          }
        },
        prepareTableState: function() {
          if (this.subscription) {
            this.data.tableState = void 0;
            return this.addGetterSetter("data", "tableState");
          }
        },
        getDataProp: function(key, index, data) {
          key = "" + key + "_" + index;
          return data[key].value;
        },
        mapColumns: function(index, data) {
          return this.tableState().columns[this.getDataProp('mDataProp', index, data)] = {
            mDataProp: this.getDataProp('mDataProp', index, data),
            bRegex: this.getDataProp('bRegex', index, data),
            bSearchable: this.getDataProp('bSearchable', index, data),
            bSortable: this.getDataProp('bSortable', index, data),
            sSearch: this.getDataProp('sSearch', index, data)
          };
        },
        mapQuery: function(key, property, searchQuery) {
          var obj;
          if (property.bSearchable !== false) {
            obj = {};
            obj[key] = {
              $regex: this.tableState().sSearch,
              $options: 'i'
            };
            return searchQuery.$or.push(obj);
          }
        },
        mapSortOrder: function(sortIndex, data) {
          var propertyIndex, propertyName;
          sortIndex = sortIndex - 1;
          propertyIndex = this.getDataProp('iSortCol', sortIndex, data);
          propertyName = this.getDataProp('mDataProp', propertyIndex, data);
          switch (this.getDataProp('sSortDir', sortIndex, data)) {
            case 'asc':
              return this.tableState().sort[propertyName] = 1;
            case 'desc':
              return this.tableState().sort[propertyName] = -1;
          }
        },
        mapTableState: function(aoData) {
          var index, key, property, searchQuery, sortIndex, _i, _j, _ref, _ref1, _ref2, _results;
          aoData = this.arrayToDictionary(aoData, 'name');
          this.log('mapTableState:aoData', aoData);
          this.tableState({
            sEcho: aoData.sEcho.value || 1,
            bRegex: aoData.bRegex.value || false,
            columns: [],
            iColumns: aoData.iColumns.value || 0,
            iSortingCols: aoData.iSortingCols.value || 0,
            sColumns: aoData.sColumns.value || "",
            iDisplayLength: aoData.iDisplayLength.value || 10,
            iDisplayStart: aoData.iDisplayStart.value || 0,
            sSearch: aoData.sSearch.value || ""
          });
          for (index = _i = 0, _ref = this.tableState().iColumns - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
            this.mapColumns(index, aoData);
          }
          if (this.tableState().sSearch !== "") {
            searchQuery = {
              $or: []
            };
            _ref1 = this.tableState().columns;
            for (key in _ref1) {
              property = _ref1[key];
              this.mapQuery(key, property, searchQuery);
            }
            if (this.query() === {}) {
              this.tableState().query = searchQuery;
            } else {
              this.tableState().query = {
                $and: [this.query(), searchQuery]
              };
            }
          } else {
            this.tableState().query = this.query();
          }
          if (this.tableState().iSortingCols > 0) {
            this.tableState().sort = {};
            _results = [];
            for (sortIndex = _j = 1, _ref2 = this.tableState().iSortingCols; 1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; sortIndex = 1 <= _ref2 ? ++_j : --_j) {
              _results.push(this.mapSortOrder(sortIndex, aoData));
            }
            return _results;
          }
        }
      });
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/mixins/Subscription.mixin.coffee.js                                     //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
DataTableMixins.Subscription = {
  extended: function() {
    this.include({
      prepareSubscription: function() {
        if (Meteor.isServer) {
          this.data.id = this.data.subscription;
          return this.addGetterSetter("data", "id");
        }
      }
    });
    if (Meteor.isClient) {
      return this.include({
        setSubscriptionOptions: function() {
          var options;
          if (!this.subscriptionOptions) {
            this.data.subscriptionOptions = void 0;
            this.addGetterSetter("data", "subscriptionOptions");
          }
          options = {
            skip: this.tableState().iDisplayStart,
            limit: this.tableState().iDisplayLength,
            sort: this.tableState().sort
          };
          this.subscriptionOptions(options);
          return this.log("subscriptionOptions", this.subscriptionOptions());
        },
        setSubscriptionHandle: function() {
          if (this.subscriptionHandle && this.subscriptionHandle().stop) {
            this.subscriptionHandle().stop();
          } else {
            this.data.subscriptionHandle = void 0;
            this.addGetterSetter("data", "subscriptionHandle");
          }
          this.subscriptionHandle(Meteor.subscribe(this.subscription(), this.collectionName(), this.query(), this.tableState().query, this.subscriptionOptions()));
          return this.log("subscriptionHandle", this.subscriptionHandle());
        },
        setSubscriptionAutorun: function(fnCallback) {
          Match.test(fnCallback, Object);
          if (this.subscriptionAutorun && this.subscriptionAutorun().stop) {
            this.subscriptionAutorun().stop();
          } else {
            this.data.subscriptionAutorun = void 0;
            this.addGetterSetter("data", "subscriptionAutorun");
          }
          this.subscriptionAutorun(Deps.autorun((function(_this) {
            return function() {
              var aaData, cursorOptions;
              if (_this.subscriptionHandle && _this.subscriptionHandle().ready()) {
                _this.log('fnServerdData:handle:ready', _this.subscriptionHandle().ready());
                cursorOptions = {
                  skip: 0
                };
                cursorOptions.limit = _this.tableState().iDisplayLength || 10;
                if (_this.tableState().sort) {
                  cursorOptions.sort = _this.tableState().sort;
                }
                if (!_this.cursor) {
                  _this.data.cursor = void 0;
                  _this.addGetterSetter("data", "cursor");
                }
                _this.cursor(_this.collection().find(_this.tableState().query, cursorOptions));
                aaData = _this.cursor().fetch();
                _this.log('fnServerData:aaData', aaData);
                return fnCallback({
                  sEcho: _this.tableState().sEcho,
                  iTotalRecords: _this.totalCount(),
                  iTotalDisplayRecords: _this.filteredCount(),
                  aaData: aaData
                });
              }
            };
          })(this)));
          return this.log("subscriptionAutorun", this.subscriptionAutorun());
        }
      });
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/mixins/Rows.mixin.coffee.js                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
DataTableMixins.Rows = {
  extended: function() {
    if (Meteor.isClient) {
      return this.include({
        prepareRows: function() {
          if (!this.data.rows) {
            this.data.rows = [];
          }
          return this.addGetterSetter("data", "rows");
        },
        getRows: function() {
          if (this.$) {
            return this.$().fnSettings().aoData || false;
          } else {
            return this.rows() || false;
          }
        },
        getRowIndex: function(_id) {
          var checkIndex, counter, index, row, rows, _i, _len;
          index = false;
          counter = 0;
          rows = this.getRows();
          checkIndex = function(row) {
            if (row._data._id === _id) {
              index = counter;
            }
            return counter++;
          };
          for (_i = 0, _len = rows.length; _i < _len; _i++) {
            row = rows[_i];
            checkIndex(row);
          }
          return index;
        }
      });
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/menway:jquery-datatables/lib/DataTables.component.coffee.js                                          //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var                    
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DataTableComponent = (function(_super) {
  __extends(DataTableComponent, _super);

  DataTableComponent.prototype.__name__ = "DataTable";

  DataTableComponent.extend(DataTableMixins.Base);

  DataTableComponent.extend(DataTableMixins.Collection);

  DataTableComponent.extend(DataTableMixins.Query);

  DataTableComponent.extend(DataTableMixins.Subscription);

  if (Meteor.isClient) {
    DataTableComponent.extend(DataTableMixins.Columns);
    DataTableComponent.extend(DataTableMixins.Rows);
    DataTableComponent.extend(ComponentMixins.ChooseTemplate);
  }

  if (Meteor.isServer) {
    DataTableComponent.extend(DataTableMixins.Publish);
  }

  function DataTableComponent(context) {
    if (context == null) {
      context = {};
    }
    DataTableComponent.__super__.constructor.apply(this, arguments);
    this.prepareSubscription();
    this.prepareCollection();
    this.prepareCountCollection();
    this.prepareQuery();
    if (Meteor.isClient) {
      this.prepareColumns();
      this.prepareRows();
      this.prepareOptions();
      this.prepareTableState();
    }
  }

  DataTableComponent.prototype.rendered = function() {
    return setTimeout(function() {
      if (Meteor.isClient) {
        this.$ = $("" + (this.selector()) + " table").dataTable(this.options());
        this.log("$", this.$);
        this.initializeFilterPlaceholder();
        this.initializeDisplayLength();
      }
      return DataTableComponent.__super__.rendered.apply(this, arguments);
    }, 0);
  };

  DataTableComponent.prototype.destroyed = function() {
    if (Meteor.isClient) {
      if ($(".ColVis_collection")) {
        $(".ColVis_collection").remove();
      }
      if (this.subscriptionAutorun && this.subscriptionAutorun().stop) {
        this.subscriptionAutorun().stop();
      }
    }
    return DataTableComponent.__super__.destroyed.apply(this, arguments);
  };

  DataTableComponent.prototype.fnServerData = function(sSource, aoData, fnCallback, oSettings) {
    if (Meteor.isClient) {
      this.mapTableState(aoData);
      this.setSubscriptionOptions();
      this.setSubscriptionHandle();
      return this.setSubscriptionAutorun(fnCallback);
    } else {
      throw new Error("fnServerData can only be called from the client.");
    }
  };

  return DataTableComponent;

})(Component);

if (Meteor.isClient) {
  Template.DataTable.created = function() {
    var dataTableInstance;
    this.__component__ = this.__view__;
    return dataTableInstance = new DataTableComponent(this);
  };
  $.fn.dataTableExt.oApi.fnGetComponent = function() {
    var oSettings;
    oSettings = this.fnSettings();
    if (oSettings) {
      if (oSettings.oInit) {
        return oSettings.oInit.component || false;
      }
    }
    throw new Error("DataTable Blaze component not instantiated");
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['menway:jquery-datatables'] = {}, {
  DataTableMixins: DataTableMixins,
  DataTableComponent: DataTableComponent
});

})();

//# sourceMappingURL=menway_jquery-datatables.js.map
