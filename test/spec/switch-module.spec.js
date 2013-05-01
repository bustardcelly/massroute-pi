var gpio = require('gpio'),
    events = require('events');

describe('switch-module', function() {
  
  var pin = 5,
      switchModule = require(process.cwd() + '/script/switch-module');

  beforeEach(function(done) {
      // TODO: Move this to a helper of beforeAll()?
      var gpioMock = Object.create(events.EventEmitter.prototype);
      gpioMock.unexport = function() {
        // swallow.
      };
      spyOn(gpio, 'export')
        .andCallFake(function(pin, config) {
          var readyTimeout;
          readyTimeout = setTimeout(function() {
            clearTimeout(readyTimeout);
            config.ready.call(null);
            done();
          }, 500);
          return gpioMock;
        });
      switchModule.configure(pin);
    });

    afterEach(function() {
      switchModule.dispose();
    });

  describe('configure()', function() {

    it('should define gpio module implementation', function() {
      expect(switchModule.module).not.toBeUndefined();
      expect(switchModule.module).not.toBeNull();
    });

    it('should emit on event based on change to \'on\' module state', function(done) {
      switchModule.on('on', function() {
        // if we go here, we were successful.
        expect(true).toEqual(true);
        done();
      });
      switchModule.module.emit('change', 1);
    });

    it('should emit off event based on change to \'off\' module state', function(done) {
      switchModule.on('off', function() {
        // if we go here, we were successful.
        expect(true).toEqual(true);
        done();
      });
      switchModule.module.emit('change', 0);
    });

  });

  describe('dispose()', function() {

    it('should unexport existant module', function() {
      var establishedModule = switchModule.module;
      spyOn(establishedModule, 'unexport');
      switchModule.dispose();
      expect(establishedModule.unexport).toHaveBeenCalled();
    });

  });

});