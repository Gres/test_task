(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var Application, Chaplin, Layout, SessionController, StorageController, mediator, routes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  mediator = require('mediator');

  routes = require('routes');

  SessionController = require('controllers/session_controller');

  StorageController = require('controllers/storage_controller');

  Layout = require('views/layout');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.title = 'Brunch example application';

    Application.prototype.initialize = function() {
      Application.__super__.initialize.apply(this, arguments);
      this.initDispatcher();
      this.initLayout();
      this.initMediator();
      this.initControllers();
      this.initRouter(routes, {
        pushState: false
      });
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    Application.prototype.initLayout = function() {
      return this.layout = new Layout({
        title: this.title
      });
    };

    Application.prototype.initControllers = function() {
      new SessionController();
      return new StorageController();
    };

    Application.prototype.initMediator = function() {
      Chaplin.mediator.user = null;
      Chaplin.mediator.banners = null;
      return Chaplin.mediator.seal();
    };

    return Application;

  })(Chaplin.Application);
  
}});

window.require.define({"controllers/banners_controller": function(exports, require, module) {
  var BannerItem, BannerPage, BannersController, Controller, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  BannerItem = require('views/banners');

  BannerPage = require('views/banner_page_view');

  mediator = require('mediator');

  module.exports = BannersController = (function(_super) {

    __extends(BannersController, _super);

    function BannersController() {
      return BannersController.__super__.constructor.apply(this, arguments);
    }

    BannersController.prototype.historyURL = 'banners';

    BannersController.prototype.index = function() {
      var collection;
      collection = mediator.banners;
      this.view = new BannerItem({
        collection: collection
      });
      collection.fetch();
      return console.info(collection);
    };

    BannersController.prototype.banner = function(route) {
      var collection, id;
      id = route.id;
      if (!collection) {
        collection = mediator.banners;
      }
      collection.fetch();
      this.model = collection.get(id);
      return this.view = new BannerPage({
        model: this.model
      });
    };

    return BannersController;

  })(Controller);
  
}});

window.require.define({"controllers/base/controller": function(exports, require, module) {
  var Chaplin, Controller,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Controller = (function(_super) {

    __extends(Controller, _super);

    function Controller() {
      return Controller.__super__.constructor.apply(this, arguments);
    }

    return Controller;

  })(Chaplin.Controller);
  
}});

window.require.define({"controllers/session_controller": function(exports, require, module) {
  var Controller, LoginView, SessionController, User, mediator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Controller = require('controllers/base/controller');

  User = require('models/user');

  LoginView = require('views/login_view');

  module.exports = SessionController = (function(_super) {

    __extends(SessionController, _super);

    function SessionController() {
      this.logout = __bind(this.logout, this);

      this.serviceProviderSession = __bind(this.serviceProviderSession, this);

      this.triggerLogin = __bind(this.triggerLogin, this);
      return SessionController.__super__.constructor.apply(this, arguments);
    }

    SessionController.serviceProviders = {};

    SessionController.prototype.loginStatusDetermined = false;

    SessionController.prototype.loginView = null;

    SessionController.prototype.serviceProviderName = null;

    SessionController.prototype.initialize = function() {
      this.subscribeEvent('serviceProviderSession', this.serviceProviderSession);
      this.subscribeEvent('logout', this.logout);
      this.subscribeEvent('userData', this.userData);
      this.subscribeEvent('!showLogin', this.showLoginView);
      this.subscribeEvent('!login', this.triggerLogin);
      this.subscribeEvent('!logout', this.triggerLogout);
      return this.getSession();
    };

    SessionController.prototype.loadServiceProviders = function() {
      var name, serviceProvider, _ref, _results;
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.load());
      }
      return _results;
    };

    SessionController.prototype.createUser = function(userData) {
      return mediator.user = new User(userData);
    };

    SessionController.prototype.getSession = function() {
      var name, serviceProvider, _ref, _results;
      this.loadServiceProviders();
      _ref = SessionController.serviceProviders;
      _results = [];
      for (name in _ref) {
        serviceProvider = _ref[name];
        _results.push(serviceProvider.done(serviceProvider.getLoginStatus));
      }
      return _results;
    };

    SessionController.prototype.showLoginView = function() {
      if (this.loginView) {
        return;
      }
      this.loadServiceProviders();
      return this.loginView = new LoginView({
        serviceProviders: SessionController.serviceProviders
      });
    };

    SessionController.prototype.triggerLogin = function(serviceProviderName) {
      var serviceProvider;
      serviceProvider = SessionController.serviceProviders[serviceProviderName];
      if (!serviceProvider.isLoaded()) {
        mediator.publish('serviceProviderMissing', serviceProviderName);
        return;
      }
      mediator.publish('loginAttempt', serviceProviderName);
      return serviceProvider.triggerLogin();
    };

    SessionController.prototype.serviceProviderSession = function(session) {
      this.serviceProviderName = session.provider.name;
      this.disposeLoginView();
      session.id = session.userId;
      delete session.userId;
      this.createUser(session);
      return this.publishLogin();
    };

    SessionController.prototype.publishLogin = function() {
      this.loginStatusDetermined = true;
      mediator.publish('login', mediator.user);
      return mediator.publish('loginStatus', true);
    };

    SessionController.prototype.triggerLogout = function() {
      return mediator.publish('logout');
    };

    SessionController.prototype.logout = function() {
      this.loginStatusDetermined = true;
      this.disposeUser();
      this.serviceProviderName = null;
      this.showLoginView();
      return mediator.publish('loginStatus', false);
    };

    SessionController.prototype.userData = function(data) {
      return mediator.user.set(data);
    };

    SessionController.prototype.disposeLoginView = function() {
      if (!this.loginView) {
        return;
      }
      this.loginView.dispose();
      return this.loginView = null;
    };

    SessionController.prototype.disposeUser = function() {
      if (!mediator.user) {
        return;
      }
      mediator.user.dispose();
      return mediator.user = null;
    };

    return SessionController;

  })(Controller);
  
}});

window.require.define({"controllers/storage_controller": function(exports, require, module) {
  var Banners, Controller, StorageController, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  mediator = require('mediator');

  Banners = require('models/banners');

  module.exports = StorageController = (function(_super) {

    __extends(StorageController, _super);

    function StorageController() {
      return StorageController.__super__.constructor.apply(this, arguments);
    }

    StorageController.prototype.initialize = function() {
      StorageController.__super__.initialize.apply(this, arguments);
      this.collection = new Banners();
      return mediator.banners = this.collection;
    };

    return StorageController;

  })(Controller);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var Application;

  Application = require('application');

  $(function() {
    var app;
    app = new Application();
    return app.initialize();
  });
  
}});

window.require.define({"lib/services/service_provider": function(exports, require, module) {
  var Chaplin, ServiceProvider, utils;

  utils = require('lib/utils');

  Chaplin = require('chaplin');

  module.exports = ServiceProvider = (function() {

    _(ServiceProvider.prototype).extend(Chaplin.Subscriber);

    ServiceProvider.prototype.loading = false;

    function ServiceProvider() {
      _(this).extend($.Deferred());
      utils.deferMethods({
        deferred: this,
        methods: ['triggerLogin', 'getLoginStatus'],
        onDeferral: this.load
      });
    }

    ServiceProvider.prototype.disposed = false;

    ServiceProvider.prototype.dispose = function() {
      if (this.disposed) {
        return;
      }
      this.unsubscribeAllEvents();
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    return ServiceProvider;

  })();

  /*

    Standard methods and their signatures:

    load: ->
      # Load a script like this:
      utils.loadLib 'http://example.org/foo.js', @loadHandler, @reject

    loadHandler: =>
      # Init the library, then resolve
      ServiceProviderLibrary.init(foo: 'bar')
      @resolve()

    isLoaded: ->
      # Return a Boolean
      Boolean window.ServiceProviderLibrary and ServiceProviderLibrary.login

    # Trigger login popup
    triggerLogin: (loginContext) ->
      callback = _(@loginHandler).bind(this, loginContext)
      ServiceProviderLibrary.login callback

    # Callback for the login popup
    loginHandler: (loginContext, response) =>

      eventPayload = {provider: this, loginContext}
      if response
        # Publish successful login
        mediator.publish 'loginSuccessful', eventPayload

        # Publish the session
        mediator.publish 'serviceProviderSession',
          provider: this
          userId: response.userId
          accessToken: response.accessToken
          # etc.

      else
        mediator.publish 'loginFail', eventPayload

    getLoginStatus: (callback = @loginStatusHandler, force = false) ->
      ServiceProviderLibrary.getLoginStatus callback, force

    loginStatusHandler: (response) =>
      return unless response
      mediator.publish 'serviceProviderSession',
        provider: this
        userId: response.userId
        accessToken: response.accessToken
        # etc.
  */

  
}});

window.require.define({"lib/support": function(exports, require, module) {
  var Chaplin, support, utils;

  Chaplin = require('chaplin');

  utils = require('lib/utils');

  support = utils.beget(Chaplin.support);

  module.exports = support;
  
}});

window.require.define({"lib/utils": function(exports, require, module) {
  var Chaplin, mediator, utils,
    __hasProp = {}.hasOwnProperty;

  Chaplin = require('chaplin');

  mediator = require('mediator');

  utils = Chaplin.utils.beget(Chaplin.utils);

  _(utils).extend({
    /*
      Wrap methods so they can be called before a deferred is resolved.
      The actual methods are called once the deferred is resolved.
    
      Parameters:
    
      Expects an options hash with the following properties:
    
      deferred
        The Deferred object to wait for.
    
      methods
        Either:
        - A string with a method name e.g. 'method'
        - An array of strings e.g. ['method1', 'method2']
        - An object with methods e.g. {method: -> alert('resolved!')}
    
      host (optional)
        If you pass an array of strings in the `methods` parameter the methods
        are fetched from this object. Defaults to `deferred`.
    
      target (optional)
        The target object the new wrapper methods are created at.
        Defaults to host if host is given, otherwise it defaults to deferred.
    
      onDeferral (optional)
        An additional callback function which is invoked when the method is called
        and the Deferred isn't resolved yet.
        After the method is registered as a done handler on the Deferred,
        this callback is invoked. This can be used to trigger the resolving
        of the Deferred.
    
      Examples:
    
      deferMethods(deferred: def, methods: 'foo')
        Wrap the method named foo of the given deferred def and
        postpone all calls until the deferred is resolved.
    
      deferMethods(deferred: def, methods: def.specialMethods)
        Read all methods from the hash def.specialMethods and
        create wrapped methods with the same names at def.
    
      deferMethods(
        deferred: def, methods: def.specialMethods, target: def.specialMethods
      )
        Read all methods from the object def.specialMethods and
        create wrapped methods at def.specialMethods,
        overwriting the existing ones.
    
      deferMethods(deferred: def, host: obj, methods: ['foo', 'bar'])
        Wrap the methods obj.foo and obj.bar so all calls to them are postponed
        until def is resolved. obj.foo and obj.bar are overwritten
        with their wrappers.
    */

    deferMethods: function(options) {
      var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;
      deferred = options.deferred;
      methods = options.methods;
      host = options.host || deferred;
      target = options.target || host;
      onDeferral = options.onDeferral;
      methodsHash = {};
      if (typeof methods === 'string') {
        methodsHash[methods] = host[methods];
      } else if (methods.length && methods[0]) {
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          name = methods[_i];
          func = host[name];
          if (typeof func !== 'function') {
            throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
          }
          methodsHash[name] = func;
        }
      } else {
        methodsHash = methods;
      }
      _results = [];
      for (name in methodsHash) {
        if (!__hasProp.call(methodsHash, name)) continue;
        func = methodsHash[name];
        if (typeof func !== 'function') {
          continue;
        }
        _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
      }
      return _results;
    },
    createDeferredFunction: function(deferred, func, context, onDeferral) {
      if (context == null) {
        context = deferred;
      }
      return function() {
        var args;
        args = arguments;
        if (deferred.state() === 'resolved') {
          return func.apply(context, args);
        } else {
          deferred.done(function() {
            return func.apply(context, args);
          });
          if (typeof onDeferral === 'function') {
            return onDeferral.apply(context);
          }
        }
      };
    }
  });

  module.exports = utils;
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  var mediator, utils;

  mediator = require('mediator');

  utils = require('chaplin/lib/utils');

  Handlebars.registerHelper('if_logged_in', function(options) {
    if (mediator.user) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('with', function(context, options) {
    if (!context || Handlebars.Utils.isEmpty(context)) {
      return options.inverse(this);
    } else {
      return options.fn(context);
    }
  });

  Handlebars.registerHelper('without', function(context, options) {
    var inverse;
    inverse = options.inverse;
    options.inverse = options.fn;
    options.fn = inverse;
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper('with_user', function(options) {
    var context;
    context = mediator.user || {};
    return Handlebars.helpers["with"].call(this, context, options);
  });

  Handlebars.registerHelper("compare", function(lvalue, rvalue, options) {
    var operator, operators, result;
    if (arguments_.length < 3) {
      throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    operator = options.hash.operator || "==";
    operators = {
      "==": function(l, r) {
        return l === r;
      },
      "===": function(l, r) {
        return l === r;
      },
      "!=": function(l, r) {
        return l !== r;
      },
      "<": function(l, r) {
        return l < r;
      },
      ">": function(l, r) {
        return l > r;
      },
      "<=": function(l, r) {
        return l <= r;
      },
      ">=": function(l, r) {
        return l >= r;
      },
      "typeof": function(l, r) {
        return typeof l === r;
      }
    };
    if (!operators[operator]) {
      throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
    }
    result = operators[operator](lvalue, rvalue);
    if (result) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper("eachProperty", function(context, options) {
    var prop, ret;
    ret = "";
    for (prop in context) {
      ret = ret + options.fn({
        property: prop,
        value: context[prop]
      });
    }
    return ret;
  });
  
}});

window.require.define({"mediator": function(exports, require, module) {
  
  module.exports = require('chaplin').mediator;
  
}});

window.require.define({"models/banner": function(exports, require, module) {
  var Banner, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Banner = (function(_super) {

    __extends(Banner, _super);

    function Banner() {
      return Banner.__super__.constructor.apply(this, arguments);
    }

    Banner.prototype.defaults = {
      time_start: null,
      time_end: null,
      hours: null,
      countries: null,
      platforms: null,
      vendor: null,
      counter: null,
      price: null
    };

    return Banner;

  })(Model);
  
}});

window.require.define({"models/banners": function(exports, require, module) {
  var Banner, Banners, Collection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Collection = require('models/base/collection');

  Banner = require('models/banner');

  module.exports = Banners = (function(_super) {

    __extends(Banners, _super);

    function Banners() {
      return Banners.__super__.constructor.apply(this, arguments);
    }

    Banners.prototype.localStorage = new Backbone.LocalStorage("Banners");

    Banners.prototype.model = Banner;

    return Banners;

  })(Collection);
  
}});

window.require.define({"models/base/collection": function(exports, require, module) {
  var Chaplin, Collection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Chaplin.Collection);
  
}});

window.require.define({"models/base/model": function(exports, require, module) {
  var Chaplin, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Chaplin.Model);
  
}});

window.require.define({"models/header": function(exports, require, module) {
  var Header, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = Header = (function(_super) {

    __extends(Header, _super);

    function Header() {
      return Header.__super__.constructor.apply(this, arguments);
    }

    return Header;

  })(Model);
  
}});

window.require.define({"models/user": function(exports, require, module) {
  var Model, User,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/base/model');

  module.exports = User = (function(_super) {

    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Model);
  
}});

window.require.define({"routes": function(exports, require, module) {
  
  module.exports = function(match) {
    match('', 'banners#index');
    match('banners', 'banners#index');
    return match('banners/:id', 'banners#banner');
  };
  
}});

window.require.define({"views/banner_item": function(exports, require, module) {
  var BannerItem, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/banner_item');

  mediator = require('mediator');

  module.exports = BannerItem = (function(_super) {

    __extends(BannerItem, _super);

    function BannerItem() {
      return BannerItem.__super__.constructor.apply(this, arguments);
    }

    BannerItem.prototype.template = template;

    BannerItem.prototype.autoRender = true;

    BannerItem.prototype.tagName = "tr";

    BannerItem.prototype.initialize = function() {
      this.delegate('click', '.clickable', this.openBanner);
      return this.delegate('click', '.remove', this.removeBanner);
    };

    BannerItem.prototype.openBanner = function() {
      return mediator.publish('!router:route', "/banners/" + this.model.id);
    };

    BannerItem.prototype.removeBanner = function() {
      var collection;
      collection = this.model.collection;
      this.model.bind("remove", function() {
        return this.destroy();
      });
      return collection.remove(this.model);
    };

    return BannerItem;

  })(View);
  
}});

window.require.define({"views/banner_new_view": function(exports, require, module) {
  var BannerNewView, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/banner_new');

  mediator = require('mediator');

  module.exports = BannerNewView = (function(_super) {

    __extends(BannerNewView, _super);

    function BannerNewView() {
      return BannerNewView.__super__.constructor.apply(this, arguments);
    }

    BannerNewView.prototype.template = template;

    BannerNewView.prototype.events = {
      "click .cancel": "closeForm",
      "submit form": "addNewBanner"
    };

    BannerNewView.prototype.closeForm = function() {
      var _this = this;
      return this.$el.hide(500, function() {
        return _this.dispose();
      });
    };

    BannerNewView.prototype.addNewBanner = function() {
      var name;
      name = this.$el.find(".name").val();
      this.collection.create({
        name: name
      });
      this.collection;
      return false;
    };

    return BannerNewView;

  })(View);
  
}});

window.require.define({"views/banner_page_view": function(exports, require, module) {
  var BannerPageView, PageView, rulesViews, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PageView = require('views/base/page_view');

  template = require('views/templates/banner_page');

  rulesViews = {
    time_start: require('views/rule/date_view'),
    time_end: require('views/rule/date_view'),
    hours: require('views/rule/hours_view'),
    days: require('views/rule/days_view'),
    countries: require('views/rule/countries_view'),
    platforms: require('views/rule/platforms_view'),
    vendor: require('views/rule/platforms_view'),
    price: require('views/rule/platforms_view'),
    counter: require('views/rule/platforms_view')
  };

  module.exports = BannerPageView = (function(_super) {

    __extends(BannerPageView, _super);

    function BannerPageView() {
      return BannerPageView.__super__.constructor.apply(this, arguments);
    }

    BannerPageView.prototype.template = template;

    BannerPageView.prototype.container = '#page-container';

    BannerPageView.prototype.autoRender = true;

    BannerPageView.prototype.events = {
      "click #add_rule_button a": "addRule"
    };

    BannerPageView.prototype.initialize = function() {
      BannerPageView.__super__.initialize.apply(this, arguments);
      return this.separateRules();
    };

    BannerPageView.prototype.afterRender = function() {
      BannerPageView.__super__.afterRender.apply(this, arguments);
      return this.renderSubviews();
    };

    BannerPageView.prototype.separateRules = function() {
      var rules;
      rules = _.extend({}, this.model.attributes);
      delete rules.rules;
      delete rules.id;
      delete rules.name;
      return this.model.set("rules", rules);
    };

    BannerPageView.prototype.renderSubviews = function() {
      var rules,
        _this = this;
      rules = this.model.get("rules");
      return _.each(rules, function(value, ruleId) {
        if (value != null) {
          return _this.subview(ruleId, new rulesViews[ruleId]({
            autoRender: true,
            "new": value === "-" ? true : void 0,
            containerMethod: 'html',
            className: "well rule " + ruleId,
            rule: ruleId,
            model: _this.model,
            container: $("#rules_nav_" + ruleId)
          }));
        }
      });
    };

    BannerPageView.prototype.addRule = function(e) {
      var el, ruleId;
      el = $(e.currentTarget);
      ruleId = el.attr("href").substring(1);
      if (!(this.model.get(ruleId) != null)) {
        this.model.set(ruleId, '-');
      }
      this.separateRules();
      this.render();
      $("#ruletabs a[href='#rules_nav_" + ruleId + "']").tab('show');
      return false;
    };

    return BannerPageView;

  })(PageView);
  
}});

window.require.define({"views/banners": function(exports, require, module) {
  var Banner, BannersView, CollectionView, createFormView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CollectionView = require('views/base/collection_view');

  Banner = require('views/banner_item');

  template = require('views/templates/banners');

  createFormView = require('views/banner_new_view');

  module.exports = BannersView = (function(_super) {

    __extends(BannersView, _super);

    function BannersView() {
      return BannersView.__super__.constructor.apply(this, arguments);
    }

    BannersView.prototype.itemView = Banner;

    BannersView.prototype.template = template;

    BannersView.prototype.listSelector = '#bannersPH';

    BannersView.prototype.container = '#page-container';

    BannersView.prototype.autoRender = true;

    BannersView.prototype.events = {
      "click #createBanner": "showCreateForm"
    };

    BannersView.prototype.removeBanner = function(e) {};

    BannersView.prototype.showCreateForm = function() {
      return this.subview('createForm', new createFormView({
        autoRender: true,
        containerMethod: 'after',
        className: "well",
        collection: this.collection,
        model: this.model,
        id: "createForm",
        container: $("#createBanner")
      }));
    };

    return BannersView;

  })(CollectionView);
  
}});

window.require.define({"views/base/collection_view": function(exports, require, module) {
  var Chaplin, CollectionView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  View = require('views/base/view');

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.getTemplateFunction = View.prototype.getTemplateFunction;

    return CollectionView;

  })(Chaplin.CollectionView);
  
}});

window.require.define({"views/base/page_view": function(exports, require, module) {
  var PageView, View, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('views/base/view');

  module.exports = PageView = (function(_super) {

    __extends(PageView, _super);

    function PageView() {
      return PageView.__super__.constructor.apply(this, arguments);
    }

    PageView.prototype.container = '#page-container';

    PageView.prototype.autoRender = true;

    PageView.prototype.renderedSubviews = false;

    PageView.prototype.initialize = function() {
      var rendered,
        _this = this;
      PageView.__super__.initialize.apply(this, arguments);
      if (this.model || this.collection) {
        rendered = false;
        return this.modelBind('change', function() {
          if (!rendered) {
            _this.render();
          }
          return rendered = true;
        });
      }
    };

    PageView.prototype.renderSubviews = function() {};

    PageView.prototype.render = function() {
      PageView.__super__.render.apply(this, arguments);
      if (!this.renderedSubviews) {
        this.renderSubviews();
        return this.renderedSubviews = true;
      }
    };

    return PageView;

  })(View);
  
}});

window.require.define({"views/base/rule_view": function(exports, require, module) {
  var View, ruleView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/base/rule');

  module.exports = ruleView = (function(_super) {

    __extends(ruleView, _super);

    function ruleView() {
      return ruleView.__super__.constructor.apply(this, arguments);
    }

    ruleView.prototype.template = template;

    return ruleView;

  })(View);
  
}});

window.require.define({"views/base/view": function(exports, require, module) {
  var Chaplin, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.dispose = function() {
      var prop, properties, subview, _i, _j, _len, _len1, _ref;
      if (this.disposed) {
        return;
      }
      if (subview) {
        _ref = this.subviews;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          subview = _ref[_i];
          subview.dispose();
        }
      }
      this.unsubscribeAllEvents();
      this.modelUnbindAll();
      this.off();
      this.$el.remove();
      properties = ['el', '$el', 'options', 'model', 'collection', 'subviews', 'subviewsByName', '_callbacks'];
      for (_j = 0, _len1 = properties.length; _j < _len1; _j++) {
        prop = properties[_j];
        delete this[prop];
      }
      this.disposed = true;
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    };

    View.prototype.getTemplateFunction = function() {
      return this.template;
    };

    return View;

  })(Chaplin.View);
  
}});

window.require.define({"views/header_view": function(exports, require, module) {
  var HeaderView, View, mediator, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  View = require('views/base/view');

  template = require('views/templates/header');

  module.exports = HeaderView = (function(_super) {

    __extends(HeaderView, _super);

    function HeaderView() {
      return HeaderView.__super__.constructor.apply(this, arguments);
    }

    HeaderView.prototype.template = template;

    HeaderView.prototype.id = 'header';

    HeaderView.prototype.className = 'header';

    HeaderView.prototype.container = '#header-container';

    HeaderView.prototype.autoRender = true;

    HeaderView.prototype.initialize = function() {
      HeaderView.__super__.initialize.apply(this, arguments);
      this.subscribeEvent('loginStatus', this.render);
      return this.subscribeEvent('startupController', this.render);
    };

    return HeaderView;

  })(View);
  
}});

window.require.define({"views/home_page_view": function(exports, require, module) {
  var HomePageView, PageView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  template = require('views/templates/home');

  PageView = require('views/base/page_view');

  module.exports = HomePageView = (function(_super) {

    __extends(HomePageView, _super);

    function HomePageView() {
      return HomePageView.__super__.constructor.apply(this, arguments);
    }

    HomePageView.prototype.template = template;

    HomePageView.prototype.className = 'home-page';

    return HomePageView;

  })(PageView);
  
}});

window.require.define({"views/hours_view": function(exports, require, module) {
  var HoursView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/hours');

  module.exports = HoursView = (function(_super) {

    __extends(HoursView, _super);

    function HoursView() {
      return HoursView.__super__.constructor.apply(this, arguments);
    }

    HoursView.prototype.template = template;

    return HoursView;

  })(View);
  
}});

window.require.define({"views/layout": function(exports, require, module) {
  var Chaplin, Layout,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  module.exports = Layout = (function(_super) {

    __extends(Layout, _super);

    function Layout() {
      return Layout.__super__.constructor.apply(this, arguments);
    }

    Layout.prototype.initialize = function() {
      return Layout.__super__.initialize.apply(this, arguments);
    };

    return Layout;

  })(Chaplin.Layout);
  
}});

window.require.define({"views/login_view": function(exports, require, module) {
  var LoginView, View, mediator, template, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  utils = require('lib/utils');

  View = require('views/base/view');

  template = require('views/templates/login');

  module.exports = LoginView = (function(_super) {

    __extends(LoginView, _super);

    function LoginView() {
      return LoginView.__super__.constructor.apply(this, arguments);
    }

    LoginView.prototype.template = template;

    LoginView.prototype.id = 'login';

    LoginView.prototype.container = '#content-container';

    LoginView.prototype.autoRender = true;

    LoginView.prototype.initialize = function(options) {
      LoginView.__super__.initialize.apply(this, arguments);
      return this.initButtons(options.serviceProviders);
    };

    LoginView.prototype.initButtons = function(serviceProviders) {
      var buttonSelector, failed, loaded, loginHandler, serviceProvider, serviceProviderName, _results;
      _results = [];
      for (serviceProviderName in serviceProviders) {
        serviceProvider = serviceProviders[serviceProviderName];
        buttonSelector = "." + serviceProviderName;
        this.$(buttonSelector).addClass('service-loading');
        loginHandler = _(this.loginWith).bind(this, serviceProviderName, serviceProvider);
        this.delegate('click', buttonSelector, loginHandler);
        loaded = _(this.serviceProviderLoaded).bind(this, serviceProviderName, serviceProvider);
        serviceProvider.done(loaded);
        failed = _(this.serviceProviderFailed).bind(this, serviceProviderName, serviceProvider);
        _results.push(serviceProvider.fail(failed));
      }
      return _results;
    };

    LoginView.prototype.loginWith = function(serviceProviderName, serviceProvider, e) {
      e.preventDefault();
      if (!serviceProvider.isLoaded()) {
        return;
      }
      mediator.publish('login:pickService', serviceProviderName);
      return mediator.publish('!login', serviceProviderName);
    };

    LoginView.prototype.serviceProviderLoaded = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading');
    };

    LoginView.prototype.serviceProviderFailed = function(serviceProviderName) {
      return this.$("." + serviceProviderName).removeClass('service-loading').addClass('service-unavailable').attr('disabled', true).attr('title', "Error connecting. Please check whether you are			blocking " + (utils.upcase(serviceProviderName)) + ".");
    };

    return LoginView;

  })(View);
  
}});

window.require.define({"views/rule/countries_view": function(exports, require, module) {
  var View, countriesView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/rule/countries');

  module.exports = countriesView = (function(_super) {

    __extends(countriesView, _super);

    function countriesView() {
      return countriesView.__super__.constructor.apply(this, arguments);
    }

    countriesView.prototype.template = template;

    return countriesView;

  })(View);
  
}});

window.require.define({"views/rule/date_view": function(exports, require, module) {
  var View, dateView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/rule/date');

  module.exports = dateView = (function(_super) {

    __extends(dateView, _super);

    function dateView() {
      return dateView.__super__.constructor.apply(this, arguments);
    }

    dateView.prototype.template = template;

    return dateView;

  })(View);
  
}});

window.require.define({"views/rule/days_view": function(exports, require, module) {
  var View, daysView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/rule/days');

  module.exports = daysView = (function(_super) {

    __extends(daysView, _super);

    function daysView() {
      return daysView.__super__.constructor.apply(this, arguments);
    }

    daysView.prototype.template = template;

    return daysView;

  })(View);
  
}});

window.require.define({"views/rule/hours_view": function(exports, require, module) {
  var View, hoursView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/rule/hours');

  module.exports = hoursView = (function(_super) {

    __extends(hoursView, _super);

    function hoursView() {
      return hoursView.__super__.constructor.apply(this, arguments);
    }

    hoursView.prototype.template = template;

    return hoursView;

  })(View);
  
}});

window.require.define({"views/rule/platforms_view": function(exports, require, module) {
  var View, platformsView, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('views/base/view');

  template = require('views/templates/rule/platforms');

  module.exports = platformsView = (function(_super) {

    __extends(platformsView, _super);

    function platformsView() {
      return platformsView.__super__.constructor.apply(this, arguments);
    }

    platformsView.prototype.template = template;

    platformsView.prototype.defaults = [
      {
        name: "linux",
        checked: null
      }, {
        name: "mac",
        checked: null
      }, {
        name: "win",
        checked: null
      }
    ];

    platformsView.prototype.events = {
      "click .save": "saveRule",
      "click .cancel": "cancel"
    };

    platformsView.prototype.initialize = function() {
      var array;
      platformsView.__super__.initialize.apply(this, arguments);
      if (!this.options["new"]) {
        array = this.model.get(this.options.rule).split(",");
        console.info(this.defaults);
        return this.data = {
          inputs: this.defaults
        };
      }
    };

    platformsView.prototype.saveRule = function() {
      var values;
      console.info();
      values = new Array();
      $(this.$el.find("input:checked")).each(function() {
        return values.push($(this).val());
      });
      this.model.set(this.options.rule, values.join());
      this.model.set("rules", null);
      return this.model.save();
    };

    platformsView.prototype.getTemplateData = function() {
      return this.data;
    };

    platformsView.prototype.cancel = function() {};

    return platformsView;

  })(View);
  
}});

window.require.define({"views/templates/banner": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/banner_item": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<td class=\"clickable name\">";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable vendor\">";
    foundHelper = helpers.vendor;
    stack1 = foundHelper || depth0.vendor;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "vendor", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable time_end\">";
    foundHelper = helpers.time_end;
    stack1 = foundHelper || depth0.time_end;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "time_end", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable time_end\">";
    foundHelper = helpers.time_end;
    stack1 = foundHelper || depth0.time_end;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "time_end", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable hours\">";
    foundHelper = helpers.hours;
    stack1 = foundHelper || depth0.hours;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "hours", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable countries\">";
    foundHelper = helpers.countries;
    stack1 = foundHelper || depth0.countries;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "countries", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable platforms\">";
    foundHelper = helpers.platforms;
    stack1 = foundHelper || depth0.platforms;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "platforms", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable counter\">";
    foundHelper = helpers.counter;
    stack1 = foundHelper || depth0.counter;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "counter", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"clickable price\">";
    foundHelper = helpers.price;
    stack1 = foundHelper || depth0.price;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "price", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</td>\n<td class=\"remove\"><button class=\"btn btn-danger\"><i class=\"icon-remove icon-white\"></i></button></td>";
    return buffer;});
}});

window.require.define({"views/templates/banner_new": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<form class=\"form-inline\">\n	<input type=\"text\" class=\"input-small name\" placeholder=\"Banner name\">\n	<button type=\"submit\" class=\"btn submit\">Create</button>\n	<button type=\"button\" class=\"btn btn-inverse cancel\">Cancel</button>\n</form>";});
}});

window.require.define({"views/templates/banner_page": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n\n\n		";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			<li><a data-toggle=\"tab\" href=\"#rules_nav_";
    foundHelper = helpers.property;
    stack1 = foundHelper || depth0.property;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "property", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.property;
    stack1 = foundHelper || depth0.property;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "property", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a></li>\n		";
    return buffer;}

  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n			";
    foundHelper = helpers.value;
    stack1 = foundHelper || depth0.value;
    stack2 = helpers['if'];
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n		";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n				<div id=\"rules_nav_";
    foundHelper = helpers.property;
    stack1 = foundHelper || depth0.property;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "property", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"tab-pane\">\n				</div>\n			";
    return buffer;}

    buffer += "<h3>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n<div class=\"btn-group\" id=\"add_rule_button\">\n	<button class=\"btn btn-large\">Add rule</button>\n	<button class=\"btn btn-large dropdown-toggle\" data-toggle=\"dropdown\">\n		<span class=\"caret\"></span>\n	</button>\n	<ul class=\"dropdown-menu\">\n		<li><a href=\"#time_start\">Time start</a></li>\n		<li><a href=\"#time_end\">Time end</a></li>\n		<li><a href=\"#hours\">Hours</a></li>\n		<li><a href=\"#days\">Days</a></li>\n		<li><a href=\"#countries\">Countries</a></li>\n		<li><a href=\"#platforms\">Platforms</a></li>\n	</ul>\n</div>\n\n<div class=\"tabbable tabs-left\" >\n	<ul class=\"nav nav-tabs\" id=\"ruletabs\">\n		";
    foundHelper = helpers.rules;
    stack1 = foundHelper || depth0.rules;
    foundHelper = helpers.eachProperty;
    stack2 = foundHelper || depth0.eachProperty;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</ul>\n	<div class=\"tab-content\">\n		";
    foundHelper = helpers.rules;
    stack1 = foundHelper || depth0.rules;
    foundHelper = helpers.eachProperty;
    stack2 = foundHelper || depth0.eachProperty;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n</div>";
    return buffer;});
}});

window.require.define({"views/templates/banners": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h3>Banners:</h3>\n<table class=\"table table-striped\">\n	<caption>Banners view</caption>\n	<thead>\n	<tr>\n		<th>Name</th>\n		<th>Vendor</th>\n		<th>Time_end</th>\n		<th>Time_end</th>\n		<th>Hours</th>\n		<th>Countries</th>\n		<th>Platforms</th>\n		<th>Counter</th>\n		<th>Price</th>\n		<th>Remove</th>\n	</tr>\n	</thead>\n	<tbody id=\"bannersPH\">\n	</tbody>\n</table>\n<button class=\"btn btn-large btn-primary\" type=\"button\" id=\"createBanner\">Create new Banner</button>\n\n";});
}});

window.require.define({"views/templates/header": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "<a class=\"header-link\" href=\"";
    foundHelper = helpers.href;
    stack1 = foundHelper || depth0.href;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "href", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a>";
    return buffer;}

    foundHelper = helpers.items;
    stack1 = foundHelper || depth0.items;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { return stack1; }
    else { return ''; }});
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<a href=\"http://brunch.io/\"> <img src=\"http://brunch.io/images/brunch.png\" alt=\"Brunch\" /> </a>\n";});
}});

window.require.define({"views/templates/login": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", foundHelper, self=this;


    return buffer;});
}});

window.require.define({"views/templates/rule/countries": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "\n<div class=\"form-actions\">\n	<button type=\"submit\" class=\"btn btn-primary save\">Save changes</button>\n	<button type=\"button\" class=\"btn cancel\">Cancel</button>\n</div>\n";});
}});

window.require.define({"views/templates/rule/date": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "date\n<div class=\"form-actions\">\n	<button type=\"submit\" class=\"btn btn-primary save\">Save changes</button>\n	<button type=\"button\" class=\"btn cancel\">Cancel</button>\n</div>\n";});
}});

window.require.define({"views/templates/rule/days": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "days\n<div class=\"form-actions\">\n	<button type=\"submit\" class=\"btn btn-primary save\">Save changes</button>\n	<button type=\"button\" class=\"btn cancel\">Cancel</button>\n</div>\n";});
}});

window.require.define({"views/templates/rule/hours": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "hours\n<div class=\"form-actions\">\n	<button type=\"submit\" class=\"btn btn-primary save\">Save changes</button>\n	<button type=\"button\" class=\"btn cancel\">Cancel</button>\n</div>\n";});
}});

window.require.define({"views/templates/rule/platforms": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n\n	<label class=\"checkbox inline\">\n		<input type=\"checkbox\" id=\"checkbox_";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" value=\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" ";
    stack1 = {};
    stack2 = "name";
    stack1['class'] = stack2;
    foundHelper = helpers.bindAttr;
    stack2 = foundHelper || depth0.bindAttr;
    tmp1 = {};
    tmp1.hash = stack1;
    if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
    else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
    else { stack1 = stack2; }
    buffer += escapeExpression(stack1) + " > ";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n	</label>\n";
    return buffer;}

    buffer += "\n";
    foundHelper = helpers.inputs;
    stack1 = foundHelper || depth0.inputs;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n<div class=\"form-actions\">\n	<button type=\"submit\" class=\"btn btn-primary save\">Save changes</button>\n	<button type=\"button\" class=\"btn cancel\">Cancel</button>\n</div>\n";
    return buffer;});
}});

