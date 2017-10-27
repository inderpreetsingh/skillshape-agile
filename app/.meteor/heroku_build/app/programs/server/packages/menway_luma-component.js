(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;

/* Package-scope variables */
var __coffeescriptShare, ComponentMixins, Component;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/menway_luma-component/packages/menway_luma-component.js                                    //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/menway:luma-component/lib/mixins/Base.mixin.coffee.js                                   //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/*
  ```coffeescript
    ComponentMixins.SomeMixin =
      extended: ->
        classProperty: "Yo Dawg"

        classMethod: ( someArg ) ->
          if _.isString someArg then return "#{ someArg }...."

        @include
          instanceProperty: "Hey..."

          instanceMethod: ( someArg ) ->
            if someArg
              return @instanceProperty

          events:
            "click": ( event, template ) ->
              template.instanceMethod event.val
  ```
 */

/*
  ```coffeescript
    class @ExampleComponent extends Component
      @extend ComponentMixins.SomeMixin
  ```
 */
                    

ComponentMixins = {};
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/menway:luma-component/lib/mixins/ChooseTemplate.mixin.coffee.js                         //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/*
  ```html
    <template name="DataTable">
      <div id="{{selector}}" class="dataTable-container">
          {{#if UI.contentBlock }}
              {{> UI.contentBlock }}
          {{else}}
              {{#with self.chooseTemplate template }}
                  {{#with .. }}     {{! original arguments to DataTable }}
                      {{> .. }}     {{! return value from chooseTemplate( template ) }}
                  {{/with}}
              {{/with}}
          {{/if}}
      </div>
    </template>

    <template name="DataTableDefault">
        <table class="table display {{../../styles}}" cellspacing="0" width="100%"></table>
    </template>
  ```
 */
ComponentMixins.ChooseTemplate = {
  extended: function() {
    if (Meteor.isClient) {
      return this.include({
        defaultTemplate: function() {
          return "" + this.__name__ + "Default";
        },
        chooseTemplate: function(template) {
          if (template == null) {
            template = null;
          }
          if (template == null) {
            template = this.defaultTemplate();
          }
          if (Template[template]) {
            template = Template[template];
          } else if (Template[this.defaultTemplate()]) {
            template = Template[this.defaultTemplate()];
          } else {
            throw new Error("" + (this.defaultTemplate()) + " is not defined.");
          }
          this.log("chooseTemplate", template);
          return template;
        }
      });
    }
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/menway:luma-component/lib/Component.coffee.js                                           //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var           
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Component = (function() {
  Component.prototype.__name__ = void 0;

  Component.prototype.events = {};

  function Component(context) {
    var attr, self, templateInstance;
    if (context == null) {
      context = {};
    }
    if (this.__name__ === void 0) {
      throw new Error("All components must have defined a unique __name__ instance property");
    }
    if (Meteor.isClient) {
      templateInstance = context;
      if ("data" in templateInstance) {
        this.data = templateInstance.data;
      }
    }
    if (Meteor.isServer) {
      this.data = context;
    }
    if (!this.data) {
      this.data = {};
    }
    if (this.data && this.defaults) {
      this.data.defaults = this.defaults;
    }
    if (!this.data.options) {
      this.data.options = {};
    }
    if (Meteor.isClient && templateInstance.__component__) {
      templateInstance.__component__.events = this.events;
      if (!this.data.id) {
        this.data.id = "" + this.__name__ + "-" + templateInstance.__component__.guid;
      }
      this.data.selector = "#" + this.data.id;
    }
    if (this.data) {
      for (attr in this.data) {
        this.addGetterSetter('data', attr);
      }
    }
    if (this.options && this.defaults) {
      this.options(_.defaults(this.options(), this.defaults()));
    }
    if (Meteor.isClient && templateInstance.__component__) {
      self = _.extend(templateInstance, this);
      self.__component__.rendered = self.rendered;
      self.__component__.destroyed = self.destroyed;
      self.data.self = self;
    }
    if (Meteor.isServer) {
      self = this;
    }
    this.log("created", self);
  }

  Component.prototype.rendered = function() {
    if (Meteor.isClient) {
      this.__component__.self = this;
      this.log("rendered", this);
    }
    if (Meteor.isServer) {
      throw new Error("Rendered callback is only available on the client.");
    }
  };

  Component.prototype.destroyed = function() {
    if (Meteor.isClient) {
      this.log("destroyed", this);
    }
    if (Meteor.isServer) {
      throw new Error("Destroyed callback is only available on the client.");
    }
  };

  Component.prototype.isDebug = function() {
    if (this.debug) {
      return this.debug();
    } else {
      return false;
    }
  };

  Component.prototype.log = function(message, object) {
    if (this.isDebug()) {
      if (this.isDebug() === "all" || message.indexOf(this.isDebug()) !== -1) {
        return console.log("" + this.__name__ + ":" + (this.id()) + ":" + message + " ->", object);
      }
    }
  };


  /*
    ```javascript
      { data:
        { doors: 2,
          color: 'red',
          options: {
            performance: [Object],
            convertible: [Object]
        }
      },
        doors: [Function],
        color: [Function],
        options: [Function]
      }
    ```
   */

  Component.prototype.addGetterSetter = function(propertyAttr, attr) {
    return this[attr] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (args.length === 0) {
        return this[propertyAttr][attr];
      } else if (args.length === 1) {
        this[propertyAttr][attr] = args[0];
        return this.log("" + propertyAttr + ":" + attr + ":set", args[0]);
      } else {
        throw new Error("Only one argument is allowed to a setter method.");
      }
    };
  };


  /*
    ```coffeescript
      ORM =
      find: ( id ) -> return id
      create: ( attrs ) -> return attrs
      extended: ->
        @include
          save: ( id ) -> return id
          destroy: ( id ) -> return true
    ```
   */

  Component.extend = function(obj) {
    var key, value, _ref;
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(Component.keywords, key) < 0) {
        this[key] = value;
      }
    }
    if ((_ref = obj.extended) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Component.include = function(obj) {
    var key, value, _ref;
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(Component.keywords, key) < 0) {
        if (key === "events") {
          this.prototype.events = _.extend(this.prototype.events, value);
        } else {
          this.prototype[key] = value;
        }
      }
    }
    if ((_ref = obj.included) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Component.keywords = ['extended', 'included'];

  return Component;

})();
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['menway:luma-component'] = {}, {
  ComponentMixins: ComponentMixins,
  Component: Component
});

})();

//# sourceMappingURL=menway_luma-component.js.map
