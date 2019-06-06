/* eslint-disable */
const { Mongo } = Package.mongo;

const globalContext = this;

const accessPropertyViaDotNotation = function (propertyName, obj) {
  const props = propertyName.split('.');
  let res = obj;
  for (let i = 0; i < props.length; i++) {
    res = res[props[i]];
    if (typeof res === 'undefined') {
      return res;
    }
  }
  return res;
};

const __original = {
  find: Mongo.Collection.prototype.find,
  findOne: Mongo.Collection.prototype.findOne,
};

//----

this._ReactiveJoins = new Mongo.Collection('reactive_joins');

if (Meteor.isServer) {
  Meteor.publish({
    reactive_joins() {
      return _ReactiveJoins.find();
    },
  });
} else {
  __original.subscribe = Meteor.subscribe;

  Meteor.subscribe = function () {
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    if (args.length) {
      const update = _ReactiveJoins.findOne({ name: args[0] });
      if (update) {
        args.push(update.updateId);
      }
    }
    return __original.subscribe.apply(null, args);
  };


  Meteor.startup(() => {
    Meteor.subscribe('reactive_joins');
  });
}


Mongo.Collection.prototype.doJoin = function (collectionObject, collectionName, collectionNameField, foreignKey, containerField, fieldList) {
  this._joins = this._joins || [];

  this._joins.push({
    collectionObject,
    collectionName,
    collectionNameField,
    foreignKey,
    containerField,
    fieldList,
  });

  this.transformFind = function (originalFind, selector, options) {
    const self = this;
    selector = selector || {};
    options = options || {};

    const originalTransform = options.transform || null;

    options.transform = function (doc) {
      _.each(self._joins, (join) => {
        const opt = {};
        if (join.fieldList && join.fieldList.length) {
          opt.fields = {};
          _.each(join.fieldList, (field) => {
            opt.fields[field] = 1;
          });
        }

        let coll = null;
        if (join.collectionObject) { coll = join.collectionObject; } else if (join.collectionName) { coll = globalContext[join.collectionName]; } else if (join.collectionNameField) { coll = globalContext[doc[join.collectionNameField]]; }

        if (coll) {
          const container = join.containerField || `${coll._name}_joined`;
          if (typeof doc[join.foreignKey] === 'string') {
            doc[container] = __original.findOne.call(coll, { _id: doc[join.foreignKey] }, opt) || {};
          } else {
            doc[container] = __original.find.call(coll, { _id: { $in: doc[join.foreignKey] || [] } }, opt).fetch() || {};
          }
        }
      });
      if (originalTransform) {
        return originalTransform(doc);
      }

      return doc;
    };
    return originalFind.call(this, selector, options);
  };

  this.findOne = function (selector, options) {
    return this.transformFind(__original.findOne, selector, options);
  };

  this.find = function (selector, options) {
    return this.transformFind(__original.find, selector, options);
  };
};

// collection argument can be collection object or collection name
Mongo.Collection.prototype.join = function (collection, foreignKey, containerField, fieldList) {
  let collectionObject = null;
  let collectionName = '';

  if (_.isString(collection)) {
    collectionName = collection;
  } else {
    collectionObject = collection;
  }

  this.doJoin(collectionObject, collectionName, '', foreignKey, containerField, fieldList);
};

Mongo.Collection.prototype.genericJoin = function (collectionNameField, foreignKey, containerField) {
  this.doJoin(null, '', collectionNameField, foreignKey, containerField, []);
};

Mongo.Collection.prototype.publishJoinedCursors = function (cursor, options, publication) {
  const self = this;
  const filters = {};
  _.each(this._joins, (join) => {
    if (join.collectionObject || join.collectionName) {
      let coll = null;

      if (join.collectionObject) {
        coll = join.collectionObject;
      } else {
        coll = globalContext[join.collectionName];
      }

      if (coll) {
        let ids = cursor.map(doc => accessPropertyViaDotNotation(join.foreignKey, doc));
        ids = _.flatten(ids);
        if (!filters[coll._name]) {
          filters[coll._name] = {
            collection: coll,
            filter: { _id: { $in: ids } },
            foreignKeys: [join.foreignKey],
          };
        } else {
          filters[coll._name].filter._id.$in = _.union(filters[coll._name].filter._id.$in, ids);
          filters[coll._name].foreignKeys.push(join.foreignKey);
        }

        const options = filters[coll._name].options || {};
        if (join.fieldList && join.fieldList.length) {
          if (!options.fields) {
            options.fields = {};
          }
          _.each(join.fieldList, (field) => {
            options.fields[field] = 1;
          });
        }
        filters[coll._name].options = options;
      }
    } else if (join.collectionNameField) {
      const data = cursor.map((doc) => {
        const res = {};
        res[join.collectionNameField] = doc[join.collectionNameField];
        res[join.foreignKey] = _.flatten(accessPropertyViaDotNotation(join.foreignKey, doc));
        return res;
      });

      const collectionNames = _.uniq(_.map(data, doc => doc[join.collectionNameField]));
      _.each(collectionNames, (collectionName) => {
        const coll = globalContext[collectionName];
        if (coll) {
          let ids = _.map(_.filter(data, doc => doc[join.collectionNameField] === collectionName), el => accessPropertyViaDotNotation(join.foreignKey, el));
          ids = _.flatten(ids);
          if (!filters[coll._name]) {
            filters[coll._name] = {
              collection: coll,
						    filter: { _id: { $in: ids } },
              foreignKeys: [join.foreignKey],
            };
          } else {
            filters[coll._name].filter._id.$in = _.union(filters[coll._name].filter._id.$in, ids);
            filters[coll._name].foreignKeys.push(join.foreignKey);
          }

          const options = filters[coll._name].options || {};
          if (join.fieldList && join.fieldList.length) {
            if (!options.fields) {
              options.fields = {};
            }
            _.each(join.fieldList, (field) => {
              options.fields[field] = 1;
            });
          }
          filters[coll._name].options = options;
        }
      });
    }
  });

  const observers = [];
  if (options && options.reactive && publication) {
    var observer = cursor.observe({
      added(newDocument) {
        if (publication._ready) {
          _ReactiveJoins.upsert({ name: publication._name }, { $set: { name: publication._name, updateId: Random.id() } });
        }
      },
      changed(newDocument, oldDocument) {
        if (publication._ready) {
          let needUpdate = false;
          for (const key in filters) {
            const filter = filters[key];
            if (filter && filter.foreignKeys) {
              filter.foreignKeys.map((foreignKey) => {
                if (oldDocument[foreignKey] != newDocument[foreignKey]) {
                  needUpdate = true;
                }
              });
            }
          }

          if (needUpdate) {
            _ReactiveJoins.upsert({ name: publication._name }, { $set: { name: publication._name, updateId: Random.id() } });
          }
        }
      },
    });

    observers.push(observer);
  }

  const cursors = [];
  cursors.push(cursor);
  for (const key in filters) {
    const filter = filters[key];
    if (filter && filter.collection && filter.filter) {
      if (filter.filter._id && filter.filter._id.$in) {
        if (typeof filter.filter._id.$in[0] === 'object') {
          filter.filter._id.$in = filter.filter._id.$in[0] || [];
        }
      }
      const cur = filter.collection.find(filter.filter, filter.options);

      if (options && options.reactive && publication) {
        var observer = cur.observe({
          changed(newDocument, oldDocument) {
            if (publication._ready) {
              _ReactiveJoins.upsert({ name: publication._name }, { $set: { name: publication._name, updateId: Random.id() } });
            }
          },
        });

        observers.push(observer);
      }

      cursors.push(cur);
    }
  }

  if (publication) {
    publication.onStop(() => {
      observers.forEach((observer) => {
        observer.stop();
      });
    });
  }
  return cursors;
};
