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
  var Application, Chaplin, HeaderController, Layout, StorageController, mediator, routes,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Chaplin = require('chaplin');

  mediator = require('mediator');

  routes = require('routes');

  HeaderController = require('controllers/header_controller');

  StorageController = require('controllers/storage_controller');

  Layout = require('views/layout');

  module.exports = Application = (function(_super) {

    __extends(Application, _super);

    function Application() {
      return Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype.title = 'Banner Management';

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
      new HeaderController();
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
      return collection.fetch();
    };

    BannersController.prototype.banner = function(route) {
      var collection, id, model;
      id = route.id;
      if (!collection) {
        collection = mediator.banners;
      }
      collection.fetch();
      model = collection.get(id);
      return this.view = new BannerPage({
        model: model
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

window.require.define({"controllers/header_controller": function(exports, require, module) {
  var Controller, Header, HeaderController, HeaderView, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Controller = require('controllers/base/controller');

  mediator = require('mediator');

  Header = require('models/header');

  HeaderView = require('views/header_view');

  module.exports = HeaderController = (function(_super) {

    __extends(HeaderController, _super);

    function HeaderController() {
      return HeaderController.__super__.constructor.apply(this, arguments);
    }

    HeaderController.prototype.initialize = function() {
      HeaderController.__super__.initialize.apply(this, arguments);
      this.model = new Header();
      return this.view = new HeaderView({
        model: this.model
      });
    };

    return HeaderController;

  })(Controller);
  
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
      counter: 0,
      price: 0
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

    Header.prototype.defaults = {
      items: [
        {
          href: '#banners',
          title: 'Main page'
        }
      ]
    };

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
        var _this = this;
        return this.destroy({
          success: function() {
            return alert(model, resp, options);
          }
        });
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
      var name,
        _this = this;
      name = this.$el.find(".name").val();
      this.collection.create({
        name: name,
        success: function(model, resp, options) {
          return alert(model, resp, options);
        }
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
      this.delegate('click', '.save', this.save);
      return this.separateRules();
    };

    BannerPageView.prototype.save = function() {
      var otherName, otherView, result, self, serialize, values, _ref;
      values = new Array();
      self = this;
      serialize = new Array();
      $(this.$el.find(".modelInput")).each(function() {
        values.push();
        if ($(this).val() || $(this).val() === 0) {
          return self.model.set($(this).attr("name"), $(this).val());
        }
      });
      _ref = this.subviewsByName;
      for (otherName in _ref) {
        otherView = _ref[otherName];
        result = otherView.saveRule();
        serialize.push("" + otherName + ":" + result);
      }
      $("#serialized").html(serialize.join(";"));
      $(".serialized").show();
      this.model.set("rules", null);
      return this.model.save();
    };

    BannerPageView.prototype.cancel = function() {};

    BannerPageView.prototype.afterRender = function() {
      BannerPageView.__super__.afterRender.apply(this, arguments);
      this.renderSubviews();
      return $("#accordion").accordion({
        header: "h3",
        heightStyle: "content"
      });
    };

    BannerPageView.prototype.separateRules = function() {
      var rules;
      rules = _.extend({}, this.model.attributes);
      delete rules.rules;
      delete rules.id;
      delete rules.name;
      delete rules.price;
      delete rules.vendor;
      delete rules.counter;
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
            containerMethod: 'append',
            className: "rule " + ruleId,
            rule: ruleId,
            model: _this.model,
            container: $("#accordion")
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

    countriesView.prototype.events = {
      "click button": "addCountry"
    };

    countriesView.prototype.initialize = function() {
      var array,
        _this = this;
      countriesView.__super__.initialize.apply(this, arguments);
      this.defaults = new Array();
      if (this.model.get(this.options.rule) === '-') {
        this.model.set(this.options.rule, null);
      }
      if (!this.options["new"]) {
        array = this.model.get(this.options.rule).split(",");
        _.each(array, function(val) {
          return _this.defaults.push({
            name: val
          });
        });
      }
      this.delegate('click', '.icon-trash', this.deleteCountry);
      this.data = {
        inputs: this.defaults,
        title: this.options.rule,
        countryArr: this.model.get(this.options.rule)
      };
      return this.on('addedToDOM', function() {
        return _this.$el.find('select').selectToAutocomplete();
      });
    };

    countriesView.prototype.addCountry = function() {
      var country, item, ul, val, _i, _len, _ref;
      country = this.$el.find('.ui-autocomplete-input').val();
      if (country === "Select Country") {
        return false;
      }
      _ref = this.defaults;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.name === country) {
          return;
        }
      }
      if (country) {
        this.defaults.push({
          name: country
        });
        val = $("#countyHidden").val();
        if (val) {
          $("#countyHidden").val("" + val + "," + country);
        } else {
          $("#countyHidden").val("" + country);
        }
        ul = this.$el.find(".countries");
        return $(ul).append("<li data-country='" + country + "'>" + country + "<i class='icon-trash'></i></li>");
      }
    };

    countriesView.prototype.deleteCountry = function(e) {
      var country, el, index, indexToRemove, item, newtxt, _i, _j, _len, _len1, _ref, _ref1;
      el = $(e.currentTarget).parent("li");
      country = el.data("country");
      newtxt = new Array();
      _ref = this.defaults;
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        item = _ref[index];
        if (item.name === country) {
          indexToRemove = index;
        }
      }
      this.defaults.splice(indexToRemove, indexToRemove);
      indexToRemove;

      _ref1 = this.defaults;
      for (index = _j = 0, _len1 = _ref1.length; _j < _len1; index = ++_j) {
        item = _ref1[index];
        newtxt.push(item.name);
      }
      $("#countyHidden").val(newtxt.join());
      return el.hide(500).remove();
    };

    countriesView.prototype.saveRule = function() {
      var values;
      values = $(this.$el.find("#countyHidden")).val();
      this.model.set(this.options.rule, values);
      this.model.set("rules", null);
      this.model.save();
      return values;
    };

    countriesView.prototype.getTemplateData = function() {
      return this.data;
    };

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

    dateView.prototype.initialize = function(options) {
      var dd,
        _this = this;
      dateView.__super__.initialize.apply(this, arguments);
      if (this.model.get(options.rule) !== "-") {
        dd = new Date(this.model.get(options.rule) * 1000);
      } else {
        dd = new Date();
      }
      this.data = {
        inputs: this.defaults,
        title: this.options.rule
      };
      return this.on('addedToDOM', function() {
        return _this.$el.find(".datepicker").datetimepicker({
          altField: "#alt_example_4_alt",
          altFieldTimeOnly: false,
          defaultDate: dd,
          hour: dd.getHours(),
          minute: dd.getMinutes()
        });
      });
    };

    dateView.prototype.saveRule = function() {
      var date;
      date = this.$el.find(".datepicker").datetimepicker("getDate").getTime() / 1000;
      this.model.set(this.options.rule, date);
      this.model.set("rules", null);
      this.model.save();
      return date;
    };

    dateView.prototype.getTemplateData = function() {
      return this.data;
    };

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

    daysView.prototype.defaults = [
      {
        name: "Mon",
        checked: null
      }, {
        name: "Tue",
        checked: null
      }, {
        name: "Wed",
        checked: null
      }, {
        name: "Thu",
        checked: null
      }, {
        name: "Fri",
        checked: null
      }, {
        name: "Sat",
        checked: null
      }, {
        name: "Sun",
        checked: null
      }
    ];

    daysView.prototype.initialize = function() {
      var array,
        _this = this;
      daysView.__super__.initialize.apply(this, arguments);
      if (!this.options["new"]) {
        array = this.model.get(this.options.rule).split(",");
        _.each(array, function(val, key) {
          if (array[key] === '1') {
            return _this.defaults[key].checked = true;
          }
        });
      }
      this.data = {
        inputs: this.defaults,
        title: this.options.rule
      };
      return this.on('addedToDOM', function() {
        return $("#daysInputs").buttonset();
      });
    };

    daysView.prototype.saveRule = function() {
      var values;
      values = new Array();
      $(this.$el.find("input")).each(function() {
        if ($(this).is(':checked')) {
          return values.push(1);
        } else {
          return values.push(0);
        }
      });
      this.model.set(this.options.rule, values.join());
      this.model.set("rules", null);
      this.model.save();
      return values.join();
    };

    daysView.prototype.getTemplateData = function() {
      return this.data;
    };

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

    hoursView.prototype.initialize = function() {
      var array, x, y, _i,
        _this = this;
      hoursView.__super__.initialize.apply(this, arguments);
      this.defaults = new Array;
      for (x = _i = 1; _i <= 24; x = ++_i) {
        y = new Object;
        y.name = x;
        y.checked = null;
        this.defaults.push(y);
      }
      if (!this.options["new"]) {
        array = this.model.get(this.options.rule).split(",");
        _.each(array, function(val, key) {
          if (array[key] === '1') {
            return _this.defaults[key].checked = true;
          }
        });
      }
      this.data = {
        inputs: this.defaults,
        title: this.options.rule
      };
      return this.on('addedToDOM', function() {
        return $("#hoursInputs").buttonset();
      });
    };

    hoursView.prototype.saveRule = function() {
      var values;
      values = new Array();
      $(this.$el.find("input")).each(function() {
        if ($(this).is(':checked')) {
          return values.push(1);
        } else {
          return values.push(0);
        }
      });
      this.model.set(this.options.rule, values.join());
      this.model.set("rules", null);
      this.model.save();
      return values.join();
    };

    hoursView.prototype.getTemplateData = function() {
      return this.data;
    };

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

    platformsView.prototype.initialize = function() {
      var array,
        _this = this;
      platformsView.__super__.initialize.apply(this, arguments);
      if (!this.options["new"]) {
        if (this.model.get(this.options.rule)) {
          array = this.model.get(this.options.rule).split(",");
        }
        _.each(array, function(val) {
          return _.each(_this.defaults, function(defval, defkey) {
            if (_this.defaults[defkey].name === val) {
              return _this.defaults[defkey].checked = true;
            }
          });
        });
      }
      this.data = {
        inputs: this.defaults,
        title: this.options.rule
      };
      return this.on('addedToDOM', function() {
        return $("#platformsInputs").buttonset();
      });
    };

    platformsView.prototype.saveRule = function() {
      var values;
      values = new Array();
      $(this.$el.find("input:checked")).each(function() {
        return values.push($(this).val());
      });
      this.model.set(this.options.rule, values.join());
      this.model.set("rules", null);
      this.model.save();
      return values.join();
    };

    platformsView.prototype.getTemplateData = function() {
      return this.data;
    };

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
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<h3>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n<form class=\"form-horizontal\" class=\"mainform\">\n	<div class=\"control-group\">\n		<label class=\"control-label\" for=\"bannerName\">Name</label>\n		<div class=\"controls\">\n			<input type=\"text\" class=\"modelInput\" name=\"name\" id=\"bannerName\" placeholder=\"Banner name\" value=\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n		</div>\n	</div>\n	<div class=\"control-group\">\n		<label class=\"control-label\" for=\"bannerVendor\">Vendor</label>\n		<div class=\"controls\">\n			<input type=\"text\" class=\"modelInput\" name=\"vendor\" id=\"bannerVendor\" placeholder=\"Vendor\" value=\"";
    foundHelper = helpers.vendor;
    stack1 = foundHelper || depth0.vendor;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "vendor", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n		</div>\n	</div>\n	<div class=\"control-group\">\n		<label class=\"control-label\" for=\"bannerPrice\">Price</label>\n		<div class=\"controls\">\n			<input type=\"text\" class=\"modelInput\" name=\"price\" id=\"bannerPrice\" placeholder=\"Price\" value=\"";
    foundHelper = helpers.price;
    stack1 = foundHelper || depth0.price;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "price", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n		</div>\n	</div>\n	<div class=\"control-group\">\n		<label class=\"control-label\" for=\"bannerPrice\">bannerCount</label>\n		<div class=\"controls\">\n			<input type=\"text\" class=\"modelInput\" name=\"count\" id=\"bannerCount\" placeholder=\"Count\" disabled value=\"";
    foundHelper = helpers.count;
    stack1 = foundHelper || depth0.count;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "count", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n		</div>\n	</div>\n	<div class=\"control-group serialized\"  style=\"display: none;\">\n		<label class=\"control-label\" for=\"serialized\">result</label>\n		<div class=\"controls\">\n			<textarea class=\"\"  name=\"serialized\" id=\"serialized\" />\n		</div>\n	</div>\n		<div class=\"btn-group\" id=\"add_rule_button\">\n			<button class=\"btn btn-large\">Add rule</button>\n			<button class=\"btn btn-large dropdown-toggle\" data-toggle=\"dropdown\">\n				<span class=\"caret\"></span>\n			</button>\n			<ul class=\"dropdown-menu\">\n				<li><a href=\"#time_start\">Time start</a></li>\n				<li><a href=\"#time_end\">Time end</a></li>\n				<li><a href=\"#hours\">Hours</a></li>\n				<li><a href=\"#days\">Days</a></li>\n				<li><a href=\"#countries\">Countries</a></li>\n				<li><a href=\"#platforms\">Platforms</a></li>\n			</ul>\n		</div>\n		<div id=\"accordion\">\n		</div>\n	<div class=\"form-actions\">\n		<button type=\"button\" class=\"save btn btn-primary\">Save changes</button>\n		<button type=\"button\" class=\"cancel btn\">Cancel</button>\n	</div>\n\n\n\n</form>";
    return buffer;});
}});

window.require.define({"views/templates/banners": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<h3>Banners:</h3>\n<table class=\"table table-striped\">\n	<thead>\n	<tr>\n		<th>Name</th>\n		<th>Vendor</th>\n		<th>Time_end</th>\n		<th>Time_end</th>\n		<th>Hours</th>\n		<th>Countries</th>\n		<th>Platforms</th>\n		<th>Counter</th>\n		<th>Price</th>\n		<th>Remove</th>\n	</tr>\n	</thead>\n	<tbody id=\"bannersPH\">\n	</tbody>\n</table>\n<button class=\"btn btn-large btn-primary\" type=\"button\" id=\"createBanner\">Create new Banner</button>\n\n";});
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
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "<li data-country='";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "'>";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "<i class=\"icon-trash\"></i></li>";
    return buffer;}

    buffer += "<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n<div class=\"ruleContent\">\n<select name=\"Country\" id=\"country-selector\" autofocus=\"autofocus\" autocorrect=\"off\" autocomplete=\"off\">\n<option value=\"\" selected=\"selected\">Select Country</option>\n<option value=\"Afghanistan\" data-alternative-spellings=\"AF افغانستان\">Afghanistan</option>\n<option value=\"Åland Islands\" data-alternative-spellings=\"AX Aaland Aland\" data-relevancy-booster=\"0.5\">Åland Islands</option>\n<option value=\"Albania\" data-alternative-spellings=\"AL\">Albania</option>\n<option value=\"Algeria\" data-alternative-spellings=\"DZ الجزائر\">Algeria</option>\n<option value=\"American Samoa\" data-alternative-spellings=\"AS\" data-relevancy-booster=\"0.5\">American Samoa</option>\n<option value=\"Andorra\" data-alternative-spellings=\"AD\" data-relevancy-booster=\"0.5\">Andorra</option>\n<option value=\"Angola\" data-alternative-spellings=\"AO\">Angola</option>\n<option value=\"Anguilla\" data-alternative-spellings=\"AI\" data-relevancy-booster=\"0.5\">Anguilla</option>\n<option value=\"Antarctica\" data-alternative-spellings=\"AQ\" data-relevancy-booster=\"0.5\">Antarctica</option>\n<option value=\"Antigua And Barbuda\" data-alternative-spellings=\"AG\" data-relevancy-booster=\"0.5\">Antigua And Barbuda</option>\n<option value=\"Argentina\" data-alternative-spellings=\"AR\">Argentina</option>\n<option value=\"Armenia\" data-alternative-spellings=\"AM Հայաստան\">Armenia</option>\n<option value=\"Aruba\" data-alternative-spellings=\"AW\" data-relevancy-booster=\"0.5\">Aruba</option>\n<option value=\"Australia\" data-alternative-spellings=\"AU\" data-relevancy-booster=\"1.5\">Australia</option>\n<option value=\"Austria\" data-alternative-spellings=\"AT Österreich Osterreich Oesterreich \">Austria</option>\n<option value=\"Azerbaijan\" data-alternative-spellings=\"AZ\">Azerbaijan</option>\n<option value=\"Bahamas\" data-alternative-spellings=\"BS\">Bahamas</option>\n<option value=\"Bahrain\" data-alternative-spellings=\"BH البحرين\">Bahrain</option>\n<option value=\"Bangladesh\" data-alternative-spellings=\"BD বাংলাদেশ\" data-relevancy-booster=\"2\">Bangladesh</option>\n<option value=\"Barbados\" data-alternative-spellings=\"BB\">Barbados</option>\n<option value=\"Belarus\" data-alternative-spellings=\"BY Беларусь\">Belarus</option>\n<option value=\"Belgium\" data-alternative-spellings=\"BE België Belgie Belgien Belgique\" data-relevancy-booster=\"1.5\">Belgium</option>\n<option value=\"Belize\" data-alternative-spellings=\"BZ\">Belize</option>\n<option value=\"Benin\" data-alternative-spellings=\"BJ\">Benin</option>\n<option value=\"Bermuda\" data-alternative-spellings=\"BM\" data-relevancy-booster=\"0.5\">Bermuda</option>\n<option value=\"Bhutan\" data-alternative-spellings=\"BT भूटान\">Bhutan</option>\n<option value=\"Bolivia\" data-alternative-spellings=\"BO\">Bolivia</option>\n<option value=\"Bonaire, Sint Eustatius and Saba\" data-alternative-spellings=\"BQ\">Bonaire, Sint Eustatius and Saba</option>\n<option value=\"Bosnia and Herzegovina\" data-alternative-spellings=\"BA Босна и Херцеговина\">Bosnia and Herzegovina</option>\n<option value=\"Botswana\" data-alternative-spellings=\"BW\">Botswana</option>\n<option value=\"Bouvet Island\" data-alternative-spellings=\"BV\">Bouvet Island</option>\n<option value=\"Brazil\" data-alternative-spellings=\"BR Brasil\" data-relevancy-booster=\"2\">Brazil</option>\n<option value=\"British Indian Ocean Territory\" data-alternative-spellings=\"IO\">British Indian Ocean Territory</option>\n<option value=\"Brunei Darussalam\" data-alternative-spellings=\"BN\">Brunei Darussalam</option>\n<option value=\"Bulgaria\" data-alternative-spellings=\"BG България\">Bulgaria</option>\n<option value=\"Burkina Faso\" data-alternative-spellings=\"BF\">Burkina Faso</option>\n<option value=\"Burundi\" data-alternative-spellings=\"BI\">Burundi</option>\n<option value=\"Cambodia\" data-alternative-spellings=\"KH កម្ពុជា\">Cambodia</option>\n<option value=\"Cameroon\" data-alternative-spellings=\"CM\">Cameroon</option>\n<option value=\"Canada\" data-alternative-spellings=\"CA\" data-relevancy-booster=\"2\">Canada</option>\n<option value=\"Cape Verde\" data-alternative-spellings=\"CV Cabo\">Cape Verde</option>\n<option value=\"Cayman Islands\" data-alternative-spellings=\"KY\" data-relevancy-booster=\"0.5\">Cayman Islands</option>\n<option value=\"Central African Republic\" data-alternative-spellings=\"CF\">Central African Republic</option>\n<option value=\"Chad\" data-alternative-spellings=\"TD تشاد‎ Tchad\">Chad</option>\n<option value=\"Chile\" data-alternative-spellings=\"CL\">Chile</option>\n<option value=\"China\" data-relevancy-booster=\"3.5\" data-alternative-spellings=\"CN Zhongguo Zhonghua Peoples Republic 中国/中华\">China</option>\n<option value=\"Christmas Island\" data-alternative-spellings=\"CX\" data-relevancy-booster=\"0.5\">Christmas Island</option>\n<option value=\"Cocos (Keeling) Islands\" data-alternative-spellings=\"CC\" data-relevancy-booster=\"0.5\">Cocos (Keeling) Islands</option>\n<option value=\"Colombia\" data-alternative-spellings=\"CO\">Colombia</option>\n<option value=\"Comoros\" data-alternative-spellings=\"KM جزر القمر\">Comoros</option>\n<option value=\"Congo\" data-alternative-spellings=\"CG\">Congo</option>\n<option value=\"Congo, the Democratic Republic of the\" data-alternative-spellings=\"CD Congo-Brazzaville Repubilika ya Kongo\">Congo, the Democratic Republic of the</option>\n<option value=\"Cook Islands\" data-alternative-spellings=\"CK\" data-relevancy-booster=\"0.5\">Cook Islands</option>\n<option value=\"Costa Rica\" data-alternative-spellings=\"CR\">Costa Rica</option>\n<option value=\"Côte d'Ivoire\" data-alternative-spellings=\"CI Cote dIvoire\">Côte d'Ivoire</option>\n<option value=\"Croatia\" data-alternative-spellings=\"HR Hrvatska\">Croatia</option>\n<option value=\"Cuba\" data-alternative-spellings=\"CU\">Cuba</option>\n<option value=\"Curaçao\" data-alternative-spellings=\"CW Curacao\">Curaçao</option>\n<option value=\"Cyprus\" data-alternative-spellings=\"CY Κύπρος Kýpros Kıbrıs\">Cyprus</option>\n<option value=\"Czech Republic\" data-alternative-spellings=\"CZ Česká Ceska\">Czech Republic</option>\n<option value=\"Denmark\" data-alternative-spellings=\"DK Danmark\" data-relevancy-booster=\"1.5\">Denmark</option>\n<option value=\"Djibouti\" data-alternative-spellings=\"DJ جيبوتي‎ Jabuuti Gabuuti\">Djibouti</option>\n<option value=\"Dominica\" data-alternative-spellings=\"DM Dominique\" data-relevancy-booster=\"0.5\">Dominica</option>\n<option value=\"Dominican Republic\" data-alternative-spellings=\"DO\">Dominican Republic</option>\n<option value=\"Ecuador\" data-alternative-spellings=\"EC\">Ecuador</option>\n<option value=\"Egypt\" data-alternative-spellings=\"EG\" data-relevancy-booster=\"1.5\">Egypt</option>\n<option value=\"El Salvador\" data-alternative-spellings=\"SV\">El Salvador</option>\n<option value=\"Equatorial Guinea\" data-alternative-spellings=\"GQ\">Equatorial Guinea</option>\n<option value=\"Eritrea\" data-alternative-spellings=\"ER إرتريا ኤርትራ\">Eritrea</option>\n<option value=\"Estonia\" data-alternative-spellings=\"EE Eesti\">Estonia</option>\n<option value=\"Ethiopia\" data-alternative-spellings=\"ET ኢትዮጵያ\">Ethiopia</option>\n<option value=\"Falkland Islands (Malvinas)\" data-alternative-spellings=\"FK\" data-relevancy-booster=\"0.5\">Falkland Islands (Malvinas)</option>\n<option value=\"Faroe Islands\" data-alternative-spellings=\"FO Føroyar Færøerne\" data-relevancy-booster=\"0.5\">Faroe Islands</option>\n<option value=\"Fiji\" data-alternative-spellings=\"FJ Viti फ़िजी\">Fiji</option>\n<option value=\"Finland\" data-alternative-spellings=\"FI Suomi\">Finland</option>\n<option value=\"France\" data-alternative-spellings=\"FR République française\" data-relevancy-booster=\"2.5\">France</option>\n<option value=\"French Guiana\" data-alternative-spellings=\"GF\">French Guiana</option>\n<option value=\"French Polynesia\" data-alternative-spellings=\"PF Polynésie française\">French Polynesia</option>\n<option value=\"French Southern Territories\" data-alternative-spellings=\"TF\">French Southern Territories</option>\n<option value=\"Gabon\" data-alternative-spellings=\"GA République Gabonaise\">Gabon</option>\n<option value=\"Gambia\" data-alternative-spellings=\"GM\">Gambia</option>\n<option value=\"Georgia\" data-alternative-spellings=\"GE საქართველო\">Georgia</option>\n<option value=\"Germany\" data-alternative-spellings=\"DE Bundesrepublik Deutschland\" data-relevancy-booster=\"3\">Germany</option>\n<option value=\"Ghana\" data-alternative-spellings=\"GH\">Ghana</option>\n<option value=\"Gibraltar\" data-alternative-spellings=\"GI\" data-relevancy-booster=\"0.5\">Gibraltar</option>\n<option value=\"Greece\" data-alternative-spellings=\"GR Ελλάδα\" data-relevancy-booster=\"1.5\">Greece</option>\n<option value=\"Greenland\" data-alternative-spellings=\"GL grønland\" data-relevancy-booster=\"0.5\">Greenland</option>\n<option value=\"Grenada\" data-alternative-spellings=\"GD\">Grenada</option>\n<option value=\"Guadeloupe\" data-alternative-spellings=\"GP\">Guadeloupe</option>\n<option value=\"Guam\" data-alternative-spellings=\"GU\">Guam</option>\n<option value=\"Guatemala\" data-alternative-spellings=\"GT\">Guatemala</option>\n<option value=\"Guernsey\" data-alternative-spellings=\"GG\" data-relevancy-booster=\"0.5\">Guernsey</option>\n<option value=\"Guinea\" data-alternative-spellings=\"GN\">Guinea</option>\n<option value=\"Guinea-Bissau\" data-alternative-spellings=\"GW\">Guinea-Bissau</option>\n<option value=\"Guyana\" data-alternative-spellings=\"GY\">Guyana</option>\n<option value=\"Haiti\" data-alternative-spellings=\"HT\">Haiti</option>\n<option value=\"Heard Island and McDonald Islands\" data-alternative-spellings=\"HM\">Heard Island and McDonald Islands</option>\n<option value=\"Holy See (Vatican City State)\" data-alternative-spellings=\"VA\" data-relevancy-booster=\"0.5\">Holy See (Vatican City State)</option>\n<option value=\"Honduras\" data-alternative-spellings=\"HN\">Honduras</option>\n<option value=\"Hong Kong\" data-alternative-spellings=\"HK 香港\">Hong Kong</option>\n<option value=\"Hungary\" data-alternative-spellings=\"HU Magyarország\">Hungary</option>\n<option value=\"Iceland\" data-alternative-spellings=\"IS Island\">Iceland</option>\n<option value=\"India\" data-alternative-spellings=\"IN भारत गणराज्य Hindustan\" data-relevancy-booster=\"3\">India</option>\n<option value=\"Indonesia\" data-alternative-spellings=\"ID\" data-relevancy-booster=\"2\">Indonesia</option>\n<option value=\"Iran, Islamic Republic of\" data-alternative-spellings=\"IR ایران\">Iran, Islamic Republic of</option>\n<option value=\"Iraq\" data-alternative-spellings=\"IQ العراق‎\">Iraq</option>\n<option value=\"Ireland\" data-alternative-spellings=\"IE Éire\" data-relevancy-booster=\"1.2\">Ireland</option>\n<option value=\"Isle of Man\" data-alternative-spellings=\"IM\" data-relevancy-booster=\"0.5\">Isle of Man</option>\n<option value=\"Israel\" data-alternative-spellings=\"IL إسرائيل ישראל\">Israel</option>\n<option value=\"Italy\" data-alternative-spellings=\"IT Italia\" data-relevancy-booster=\"2\">Italy</option>\n<option value=\"Jamaica\" data-alternative-spellings=\"JM\">Jamaica</option>\n<option value=\"Japan\" data-alternative-spellings=\"JP Nippon Nihon 日本\" data-relevancy-booster=\"2.5\">Japan</option>\n<option value=\"Jersey\" data-alternative-spellings=\"JE\" data-relevancy-booster=\"0.5\">Jersey</option>\n<option value=\"Jordan\" data-alternative-spellings=\"JO الأردن\">Jordan</option>\n<option value=\"Kazakhstan\" data-alternative-spellings=\"KZ Қазақстан Казахстан\">Kazakhstan</option>\n<option value=\"Kenya\" data-alternative-spellings=\"KE\">Kenya</option>\n<option value=\"Kiribati\" data-alternative-spellings=\"KI\">Kiribati</option>\n<option value=\"Korea, Democratic People's Republic of\" data-alternative-spellings=\"KP North Korea\">Korea, Democratic People's Republic of</option>\n<option value=\"Korea, Republic of\" data-alternative-spellings=\"KR South Korea\" data-relevancy-booster=\"1.5\">Korea, Republic of</option>\n<option value=\"Kuwait\" data-alternative-spellings=\"KW الكويت\">Kuwait</option>\n<option value=\"Kyrgyzstan\" data-alternative-spellings=\"KG Кыргызстан\">Kyrgyzstan</option>\n<option value=\"Lao People's Democratic Republic\" data-alternative-spellings=\"LA\">Lao People's Democratic Republic</option>\n<option value=\"Latvia\" data-alternative-spellings=\"LV Latvija\">Latvia</option>\n<option value=\"Lebanon\" data-alternative-spellings=\"LB لبنان\">Lebanon</option>\n<option value=\"Lesotho\" data-alternative-spellings=\"LS\">Lesotho</option>\n<option value=\"Liberia\" data-alternative-spellings=\"LR\">Liberia</option>\n<option value=\"Libyan Arab Jamahiriya\" data-alternative-spellings=\"LY ليبيا\">Libyan Arab Jamahiriya</option>\n<option value=\"Liechtenstein\" data-alternative-spellings=\"LI\">Liechtenstein</option>\n<option value=\"Lithuania\" data-alternative-spellings=\"LT Lietuva\">Lithuania</option>\n<option value=\"Luxembourg\" data-alternative-spellings=\"LU\">Luxembourg</option>\n<option value=\"Macao\" data-alternative-spellings=\"MO\">Macao</option>\n<option value=\"Macedonia, The Former Yugoslav Republic Of\" data-alternative-spellings=\"MK Македонија\">Macedonia, The Former Yugoslav Republic Of</option>\n<option value=\"Madagascar\" data-alternative-spellings=\"MG Madagasikara\">Madagascar</option>\n<option value=\"Malawi\" data-alternative-spellings=\"MW\">Malawi</option>\n<option value=\"Malaysia\" data-alternative-spellings=\"MY\">Malaysia</option>\n<option value=\"Maldives\" data-alternative-spellings=\"MV\">Maldives</option>\n<option value=\"Mali\" data-alternative-spellings=\"ML\">Mali</option>\n<option value=\"Malta\" data-alternative-spellings=\"MT\">Malta</option>\n<option value=\"Marshall Islands\" data-alternative-spellings=\"MH\" data-relevancy-booster=\"0.5\">Marshall Islands</option>\n<option value=\"Martinique\" data-alternative-spellings=\"MQ\">Martinique</option>\n<option value=\"Mauritania\" data-alternative-spellings=\"MR الموريتانية\">Mauritania</option>\n<option value=\"Mauritius\" data-alternative-spellings=\"MU\">Mauritius</option>\n<option value=\"Mayotte\" data-alternative-spellings=\"YT\">Mayotte</option>\n<option value=\"Mexico\" data-alternative-spellings=\"MX Mexicanos\" data-relevancy-booster=\"1.5\">Mexico</option>\n<option value=\"Micronesia, Federated States of\" data-alternative-spellings=\"FM\">Micronesia, Federated States of</option>\n<option value=\"Moldova, Republic of\" data-alternative-spellings=\"MD\">Moldova, Republic of</option>\n<option value=\"Monaco\" data-alternative-spellings=\"MC\">Monaco</option>\n<option value=\"Mongolia\" data-alternative-spellings=\"MN Mongγol ulus Монгол улс\">Mongolia</option>\n<option value=\"Montenegro\" data-alternative-spellings=\"ME\">Montenegro</option>\n<option value=\"Montserrat\" data-alternative-spellings=\"MS\" data-relevancy-booster=\"0.5\">Montserrat</option>\n<option value=\"Morocco\" data-alternative-spellings=\"MA المغرب\">Morocco</option>\n<option value=\"Mozambique\" data-alternative-spellings=\"MZ Moçambique\">Mozambique</option>\n<option value=\"Myanmar\" data-alternative-spellings=\"MM\">Myanmar</option>\n<option value=\"Namibia\" data-alternative-spellings=\"NA Namibië\">Namibia</option>\n<option value=\"Nauru\" data-alternative-spellings=\"NR Naoero\" data-relevancy-booster=\"0.5\">Nauru</option>\n<option value=\"Nepal\" data-alternative-spellings=\"NP नेपाल\">Nepal</option>\n<option value=\"Netherlands\" data-alternative-spellings=\"NL Holland Nederland\" data-relevancy-booster=\"1.5\">Netherlands</option>\n<option value=\"New Caledonia\" data-alternative-spellings=\"NC\" data-relevancy-booster=\"0.5\">New Caledonia</option>\n<option value=\"New Zealand\" data-alternative-spellings=\"NZ Aotearoa\">New Zealand</option>\n<option value=\"Nicaragua\" data-alternative-spellings=\"NI\">Nicaragua</option>\n<option value=\"Niger\" data-alternative-spellings=\"NE Nijar\">Niger</option>\n<option value=\"Nigeria\" data-alternative-spellings=\"NG Nijeriya Naíjíríà\" data-relevancy-booster=\"1.5\">Nigeria</option>\n<option value=\"Niue\" data-alternative-spellings=\"NU\" data-relevancy-booster=\"0.5\">Niue</option>\n<option value=\"Norfolk Island\" data-alternative-spellings=\"NF\" data-relevancy-booster=\"0.5\">Norfolk Island</option>\n<option value=\"Northern Mariana Islands\" data-alternative-spellings=\"MP\" data-relevancy-booster=\"0.5\">Northern Mariana Islands</option>\n<option value=\"Norway\" data-alternative-spellings=\"NO Norge Noreg\" data-relevancy-booster=\"1.5\">Norway</option>\n<option value=\"Oman\" data-alternative-spellings=\"OM عمان\">Oman</option>\n<option value=\"Pakistan\" data-alternative-spellings=\"PK پاکستان\" data-relevancy-booster=\"2\">Pakistan</option>\n<option value=\"Palau\" data-alternative-spellings=\"PW\" data-relevancy-booster=\"0.5\">Palau</option>\n<option value=\"Palestinian Territory, Occupied\" data-alternative-spellings=\"PS فلسطين\">Palestinian Territory, Occupied</option>\n<option value=\"Panama\" data-alternative-spellings=\"PA\">Panama</option>\n<option value=\"Papua New Guinea\" data-alternative-spellings=\"PG\">Papua New Guinea</option>\n<option value=\"Paraguay\" data-alternative-spellings=\"PY\">Paraguay</option>\n<option value=\"Peru\" data-alternative-spellings=\"PE\">Peru</option>\n<option value=\"Philippines\" data-alternative-spellings=\"PH Pilipinas\" data-relevancy-booster=\"1.5\">Philippines</option>\n<option value=\"Pitcairn\" data-alternative-spellings=\"PN\" data-relevancy-booster=\"0.5\">Pitcairn</option>\n<option value=\"Poland\" data-alternative-spellings=\"PL Polska\" data-relevancy-booster=\"1.25\">Poland</option>\n<option value=\"Portugal\" data-alternative-spellings=\"PT Portuguesa\" data-relevancy-booster=\"1.5\">Portugal</option>\n<option value=\"Puerto Rico\" data-alternative-spellings=\"PR\">Puerto Rico</option>\n<option value=\"Qatar\" data-alternative-spellings=\"QA قطر\">Qatar</option>\n<option value=\"Réunion\" data-alternative-spellings=\"RE Reunion\">Réunion</option>\n<option value=\"Romania\" data-alternative-spellings=\"RO Rumania Roumania România\">Romania</option>\n<option value=\"Russian Federation\" data-alternative-spellings=\"RU Rossiya Российская Россия\" data-relevancy-booster=\"2.5\">Russian Federation</option>\n<option value=\"Rwanda\" data-alternative-spellings=\"RW\">Rwanda</option>\n<option value=\"Saint Barthélemy\" data-alternative-spellings=\"BL St. Barthelemy\">Saint Barthélemy</option>\n<option value=\"Saint Helena\" data-alternative-spellings=\"SH St.\">Saint Helena</option>\n<option value=\"Saint Kitts and Nevis\" data-alternative-spellings=\"KN St.\">Saint Kitts and Nevis</option>\n<option value=\"Saint Lucia\" data-alternative-spellings=\"LC St.\">Saint Lucia</option>\n<option value=\"Saint Martin (French Part)\" data-alternative-spellings=\"MF St.\">Saint Martin (French Part)</option>\n<option value=\"Saint Pierre and Miquelon\" data-alternative-spellings=\"PM St.\">Saint Pierre and Miquelon</option>\n<option value=\"Saint Vincent and the Grenadines\" data-alternative-spellings=\"VC St.\">Saint Vincent and the Grenadines</option>\n<option value=\"Samoa\" data-alternative-spellings=\"WS\">Samoa</option>\n<option value=\"San Marino\" data-alternative-spellings=\"SM\">San Marino</option>\n<option value=\"Sao Tome and Principe\" data-alternative-spellings=\"ST\">Sao Tome and Principe</option>\n<option value=\"Saudi Arabia\" data-alternative-spellings=\"SA السعودية\">Saudi Arabia</option>\n<option value=\"Senegal\" data-alternative-spellings=\"SN Sénégal\">Senegal</option>\n<option value=\"Serbia\" data-alternative-spellings=\"RS Србија Srbija\">Serbia</option>\n<option value=\"Seychelles\" data-alternative-spellings=\"SC\" data-relevancy-booster=\"0.5\">Seychelles</option>\n<option value=\"Sierra Leone\" data-alternative-spellings=\"SL\">Sierra Leone</option>\n<option value=\"Singapore\" data-alternative-spellings=\"SG Singapura சிங்கப்பூர் குடியரசு 新加坡共和国\">Singapore</option>\n<option value=\"Sint Maarten (Dutch Part)\" data-alternative-spellings=\"SX\">Sint Maarten (Dutch Part)</option>\n<option value=\"Slovakia\" data-alternative-spellings=\"SK Slovenská Slovensko\">Slovakia</option>\n<option value=\"Slovenia\" data-alternative-spellings=\"SI Slovenija\">Slovenia</option>\n<option value=\"Solomon Islands\" data-alternative-spellings=\"SB\">Solomon Islands</option>\n<option value=\"Somalia\" data-alternative-spellings=\"SO الصومال\">Somalia</option>\n<option value=\"South Africa\" data-alternative-spellings=\"ZA RSA Suid-Afrika\">South Africa</option>\n<option value=\"South Georgia and the South Sandwich Islands\" data-alternative-spellings=\"GS\">South Georgia and the South Sandwich Islands</option>\n<option value=\"South Sudan\" data-alternative-spellings=\"SS\">South Sudan</option>\n<option value=\"Spain\" data-alternative-spellings=\"ES España\" data-relevancy-booster=\"2\">Spain</option>\n<option value=\"Sri Lanka\" data-alternative-spellings=\"LK ශ්‍රී ලංකා இலங்கை Ceylon\">Sri Lanka</option>\n<option value=\"Sudan\" data-alternative-spellings=\"SD السودان\">Sudan</option>\n<option value=\"Suriname\" data-alternative-spellings=\"SR शर्नम् Sarnam Sranangron\">Suriname</option>\n<option value=\"Svalbard and Jan Mayen\" data-alternative-spellings=\"SJ\" data-relevancy-booster=\"0.5\">Svalbard and Jan Mayen</option>\n<option value=\"Swaziland\" data-alternative-spellings=\"SZ weSwatini Swatini Ngwane\">Swaziland</option>\n<option value=\"Sweden\" data-alternative-spellings=\"SE Sverige\" data-relevancy-booster=\"1.5\">Sweden</option>\n<option value=\"Switzerland\" data-alternative-spellings=\"CH Swiss Confederation Schweiz Suisse Svizzera Svizra\" data-relevancy-booster=\"1.5\">Switzerland</option>\n<option value=\"Syrian Arab Republic\" data-alternative-spellings=\"SY Syria سورية\">Syrian Arab Republic</option>\n<option value=\"Taiwan, Province of China\" data-alternative-spellings=\"TW 台灣 臺灣\">Taiwan, Province of China</option>\n<option value=\"Tajikistan\" data-alternative-spellings=\"TJ Тоҷикистон Toçikiston\">Tajikistan</option>\n<option value=\"Tanzania, United Republic of\" data-alternative-spellings=\"TZ\">Tanzania, United Republic of</option>\n<option value=\"Thailand\" data-alternative-spellings=\"TH ประเทศไทย Prathet Thai\">Thailand</option>\n<option value=\"Timor-Leste\" data-alternative-spellings=\"TL\">Timor-Leste</option>\n<option value=\"Togo\" data-alternative-spellings=\"TG Togolese\">Togo</option>\n<option value=\"Tokelau\" data-alternative-spellings=\"TK\" data-relevancy-booster=\"0.5\">Tokelau</option>\n<option value=\"Tonga\" data-alternative-spellings=\"TO\">Tonga</option>\n<option value=\"Trinidad and Tobago\" data-alternative-spellings=\"TT\">Trinidad and Tobago</option>\n<option value=\"Tunisia\" data-alternative-spellings=\"TN تونس\">Tunisia</option>\n<option value=\"Turkey\" data-alternative-spellings=\"TR Türkiye Turkiye\">Turkey</option>\n<option value=\"Turkmenistan\" data-alternative-spellings=\"TM Türkmenistan\">Turkmenistan</option>\n<option value=\"Turks and Caicos Islands\" data-alternative-spellings=\"TC\" data-relevancy-booster=\"0.5\">Turks and Caicos Islands</option>\n<option value=\"Tuvalu\" data-alternative-spellings=\"TV\" data-relevancy-booster=\"0.5\">Tuvalu</option>\n<option value=\"Uganda\" data-alternative-spellings=\"UG\">Uganda</option>\n<option value=\"Ukraine\" data-alternative-spellings=\"UA Ukrayina Україна\">Ukraine</option>\n<option value=\"United Arab Emirates\" data-alternative-spellings=\"AE UAE الإمارات\">United Arab Emirates</option>\n<option value=\"United Kingdom\" data-alternative-spellings=\"GB Great Britain England UK Wales Scotland Northern Ireland\" data-relevancy-booster=\"2.5\">United Kingdom</option>\n<option value=\"United States\" data-relevancy-booster=\"3.5\" data-alternative-spellings=\"US USA United States of America\">United States</option>\n<option value=\"United States Minor Outlying Islands\" data-alternative-spellings=\"UM\">United States Minor Outlying Islands</option>\n<option value=\"Uruguay\" data-alternative-spellings=\"UY\">Uruguay</option>\n<option value=\"Uzbekistan\" data-alternative-spellings=\"UZ Ўзбекистон O'zbekstan O‘zbekiston\">Uzbekistan</option>\n<option value=\"Vanuatu\" data-alternative-spellings=\"VU\">Vanuatu</option>\n<option value=\"Venezuela\" data-alternative-spellings=\"VE\">Venezuela</option>\n<option value=\"Vietnam\" data-alternative-spellings=\"VN Việt Nam\" data-relevancy-booster=\"1.5\">Vietnam</option>\n<option value=\"Virgin Islands, British\" data-alternative-spellings=\"VG\" data-relevancy-booster=\"0.5\">Virgin Islands, British</option>\n<option value=\"Virgin Islands, U.S.\" data-alternative-spellings=\"VI\" data-relevancy-booster=\"0.5\">Virgin Islands, U.S.</option>\n<option value=\"Wallis and Futuna\" data-alternative-spellings=\"WF\" data-relevancy-booster=\"0.5\">Wallis and Futuna</option>\n<option value=\"Western Sahara\" data-alternative-spellings=\"EH لصحراء الغربية\">Western Sahara</option>\n<option value=\"Yemen\" data-alternative-spellings=\"YE اليمن\">Yemen</option>\n<option value=\"Zambia\" data-alternative-spellings=\"ZM\">Zambia</option>\n<option value=\"Zimbabwe\" data-alternative-spellings=\"ZW\">Zimbabwe</option>\n</select>\n<button type=\"button\" class=\"btn\">Add</button>\n<input type=\"hidden\" name=\"countyHidden\" id=\"countyHidden\" value=\"";
    foundHelper = helpers.countryArr;
    stack1 = foundHelper || depth0.countryArr;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "countryArr", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" />\n<ul class=\"countries\">\n	";
    foundHelper = helpers.inputs;
    stack1 = foundHelper || depth0.inputs;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n</ul>\n</div>";
    return buffer;});
}});

window.require.define({"views/templates/rule/date": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n<div class=\"ruleContent\">\n	<div class=\"datepicker\"></div>\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/rule/days": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		<input type=\"checkbox\" id=\"days_";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" value=\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" name=\"days\" ";
    foundHelper = helpers.checked;
    stack1 = foundHelper || depth0.checked;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " /><label for=\"days_";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"checkbox inline\"> ";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "	</label>\n		";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "checked=\"checked\" ";}

    buffer += "\n<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n<div class=\"ruleContent\">\n	<div class=\"inputs\" id=\"daysInputs\">\n		";
    foundHelper = helpers.inputs;
    stack1 = foundHelper || depth0.inputs;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/rule/hours": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		<input type=\"checkbox\" id=\"hours_";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" value=\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" name=\"hours\" ";
    foundHelper = helpers.checked;
    stack1 = foundHelper || depth0.checked;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " /><label for=\"hours_";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"checkbox inline\"> ";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "	</label>\n		";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "checked=\"checked\" ";}

    buffer += "<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n<div class=\"ruleContent\">\n	<div class=\"inputs\" id=\"hoursInputs\">\n		";
    foundHelper = helpers.inputs;
    stack1 = foundHelper || depth0.inputs;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n</div>\n";
    return buffer;});
}});

window.require.define({"views/templates/rule/platforms": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2;
    buffer += "\n		<input type=\"checkbox\" id=\"platforms_";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" value=\"";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" name=\"platforms\" ";
    foundHelper = helpers.checked;
    stack1 = foundHelper || depth0.checked;
    stack2 = helpers['if'];
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += " /><label for=\"platforms_";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"checkbox inline\"> ";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + "	</label>\n		";
    return buffer;}
  function program2(depth0,data) {
    
    
    return "checked=\"checked\" ";}

    buffer += "<h3>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h3>\n<div class=\"ruleContent\">\n	<div class=\"inputs\" id=\"platformsInputs\">\n		";
    foundHelper = helpers.inputs;
    stack1 = foundHelper || depth0.inputs;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n	</div>\n</div>\n\n";
    return buffer;});
}});

