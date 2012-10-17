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

window.require.define({"test/bootstrap-button": function(exports, require, module) {
  /* ============================================================
   * bootstrap-button.js v2.1.1
   * http://twitter.github.com/bootstrap/javascript.html#buttons
   * ============================================================
   * Copyright 2012 Twitter, Inc.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * ============================================================ */


  !function ($) {

    "use strict"; // jshint ;_;


   /* BUTTON PUBLIC CLASS DEFINITION
    * ============================== */

    var Button = function (element, options) {
      this.$element = $(element)
      this.options = $.extend({}, $.fn.button.defaults, options)
    }

    Button.prototype.setState = function (state) {
      var d = 'disabled'
        , $el = this.$element
        , data = $el.data()
        , val = $el.is('input') ? 'val' : 'html'

      state = state + 'Text'
      data.resetText || $el.data('resetText', $el[val]())

      $el[val](data[state] || this.options[state])

      // push to event loop to allow forms to submit
      setTimeout(function () {
        state == 'loadingText' ?
          $el.addClass(d).attr(d, d) :
          $el.removeClass(d).removeAttr(d)
      }, 0)
    }

    Button.prototype.toggle = function () {
      var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

      $parent && $parent
        .find('.active')
        .removeClass('active')

      this.$element.toggleClass('active')
    }


   /* BUTTON PLUGIN DEFINITION
    * ======================== */

    $.fn.button = function (option) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('button')
          , options = typeof option == 'object' && option
        if (!data) $this.data('button', (data = new Button(this, options)))
        if (option == 'toggle') data.toggle()
        else if (option) data.setState(option)
      })
    }

    $.fn.button.defaults = {
      loadingText: 'loading...'
    }

    $.fn.button.Constructor = Button


   /* BUTTON DATA-API
    * =============== */

    $(function () {
      $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
        var $btn = $(e.target)
        if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
        $btn.button('toggle')
      })
    })

  }(window.jQuery);
}});

window.require.define({"test/controllers/banners_controller_test": function(exports, require, module) {
  var Banners;

  Banners = require('models/banners');

  describe('Banners', function() {
    return beforeEach(function() {
      return this.model = new Banners();
    });
  });
  
}});

window.require.define({"test/models/banner": function(exports, require, module) {
  var Banner;

  Banner = require('models/banner');

  describe('Banner', function() {
    return beforeEach(function() {
      return this.model = new Banner();
    });
  });
  
}});

window.require.define({"test/models/banners_test": function(exports, require, module) {
  

  
}});

window.require.define({"test/models/header_test": function(exports, require, module) {
  var Header;

  Header = require('models/header');

  describe('Header', function() {
    beforeEach(function() {
      return this.model = new Header();
    });
    afterEach(function() {
      return this.model.dispose();
    });
    return it('should contain 4 items', function() {
      return expect(this.model.get('items')).to.have.length(4);
    });
  });
  
}});

window.require.define({"test/test-helpers": function(exports, require, module) {
  var chai, sinonChai;

  chai = require('chai');

  sinonChai = require('sinon-chai');

  chai.use(sinonChai);

  module.exports = {
    expect: chai.expect,
    sinon: require('sinon')
  };
  
}});

window.require.define({"test/views/banner_new_view": function(exports, require, module) {
  var BannerNewView;

  BannerNewView = require('views/banner_new_view');

  describe('BannerNewView', function() {
    return beforeEach(function() {
      return this.view = new BannerNewView();
    });
  });
  
}});

window.require.define({"test/views/banner_view": function(exports, require, module) {
  var BannerItem;

  BannerItem = require('views/banner_view');

  describe('BannerItem', function() {
    return beforeEach(function() {
      return this.view = new BannerItem();
    });
  });
  
}});

window.require.define({"test/views/base/rule_view": function(exports, require, module) {
  var ruleView;

  Base / (ruleView = require('views/base/rule_view'));

  describe('Base/ruleView', function() {
    return beforeEach(function() {
      return this.view = new Base / ruleView();
    });
  });
  
}});

window.require.define({"test/views/header_view_test": function(exports, require, module) {
  var Header, HeaderView, HeaderViewTest, mediator,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  mediator = require('mediator');

  Header = require('models/header');

  HeaderView = require('views/header_view');

  HeaderViewTest = (function(_super) {

    __extends(HeaderViewTest, _super);

    function HeaderViewTest() {
      return HeaderViewTest.__super__.constructor.apply(this, arguments);
    }

    HeaderViewTest.prototype.renderTimes = 0;

    HeaderViewTest.prototype.render = function() {
      HeaderViewTest.__super__.render.apply(this, arguments);
      return this.renderTimes += 1;
    };

    return HeaderViewTest;

  })(HeaderView);

  describe('HeaderView', function() {
    beforeEach(function() {
      this.model = new Header();
      return this.view = new HeaderViewTest({
        model: this.model
      });
    });
    afterEach(function() {
      this.view.dispose();
      return this.model.dispose();
    });
    it('should display 4 links', function() {
      return expect(this.view.$el.find('a')).to.have.length(4);
    });
    return it('should re-render on login event', function() {
      expect(this.view.renderTimes).to.equal(1);
      mediator.publish('loginStatus');
      return expect(this.view.renderTimes).to.equal(2);
    });
  });
  
}});

window.require.define({"test/views/home_page_view_test": function(exports, require, module) {
  var HomePageView;

  HomePageView = require('views/home_page_view');

  describe('HomePageView', function() {
    beforeEach(function() {
      return this.view = new HomePageView();
    });
    afterEach(function() {
      return this.view.dispose();
    });
    return it('should auto-render', function() {
      return expect(this.view.$el.find('img')).to.have.length(1);
    });
  });
  
}});

window.require.define({"test/views/hours_view": function(exports, require, module) {
  var HoursView;

  HoursView = require('views/hours_view');

  describe('HoursView', function() {
    return beforeEach(function() {
      return this.view = new HoursView();
    });
  });
  
}});

window.require.define({"test/views/rule/countries_view": function(exports, require, module) {
  var countriesView;

  Rule / (countriesView = require('views/rule/countries_view'));

  describe('Rule/countriesView', function() {
    return beforeEach(function() {
      return this.view = new Rule / countriesView();
    });
  });
  
}});

window.require.define({"test/views/rule/date_view": function(exports, require, module) {
  var dateView;

  Rule / (dateView = require('views/rule/date_view'));

  describe('Rule/dateView', function() {
    return beforeEach(function() {
      return this.view = new Rule / dateView();
    });
  });
  
}});

window.require.define({"test/views/rule/days_view": function(exports, require, module) {
  var daysView;

  Rule / (daysView = require('views/rule/days_view'));

  describe('Rule/daysView', function() {
    return beforeEach(function() {
      return this.view = new Rule / daysView();
    });
  });
  
}});

window.require.define({"test/views/rule/hours_view": function(exports, require, module) {
  var hoursView;

  Rule / (hoursView = require('views/rule/hours_view'));

  describe('Rule/hoursView', function() {
    return beforeEach(function() {
      return this.view = new Rule / hoursView();
    });
  });
  
}});

window.require.define({"test/views/rule/platrforms_view": function(exports, require, module) {
  var platrformsView;

  Rule / (platrformsView = require('views/rule/platrforms_view'));

  describe('Rule/platrformsView', function() {
    return beforeEach(function() {
      return this.view = new Rule / platrformsView();
    });
  });
  
}});

window.require('test/controllers/banners_controller_test');
window.require('test/models/banners_test');
window.require('test/models/header_test');
window.require('test/views/header_view_test');
window.require('test/views/home_page_view_test');
