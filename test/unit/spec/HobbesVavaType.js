require('../../../hobbes/extensions');
var type = require('../../../hobbes/vava/type');

describe('Vava Types', function () {
  
  describe('TypedVariable', function () {
    
    // Common
    var testVariable = null;
    
    beforeEach(function () {
      testVariable = new type.TypedVariable('Foo', 'bar');
    });
    
    it('should tell its Vava type', function () {
      expect(testVariable.getVavaType()).toBe('Foo');
    });
    
    it('should set correct default for int', function () {
      testVariable = new type.TypedVariable('int', 'foo');
      expect(testVariable.get().get()).toBe(0);
    });
    
  }); // end TypedVariable
  
  describe('Typed values', function () {
    
    // Common
    var testValue = null;
    
    // Used for tests concerning all typed values
    function commonTypedValueTests() {
      // it should implement TypedValueInterface
      expect(type.TypedValueInterface.check(testValue)).not.toBeDefined();
    };
    
    describe('TypedValue', function () {
      
      beforeEach(function () {
        testValue = new type.TypedValue('foo', 'bar');
      });
      
      it('should satisfy common requirements for typed values', commonTypedValueTests);
      
      it('should have type `foo`', function () {
        expect(testValue.getVavaType()).toBe('foo');
      });
      
      it('should have value `bar`', function () {
        expect(testValue.get()).toBe('bar');
      });
      
    }); // end TypedValue

    describe('ByteValue', function () {

      beforeEach(function () {
        testValue = new type.ByteValue();
      });
      
      it('should satisfy common requirements for typed values', commonTypedValueTests);
      
      it('should have type `byte`', function () {
        expect(testValue.getVavaType()).toBe('byte');
      });

      it('should compute twos complement', function () {
        expect(type.ByteValue.twosComplement(2)).toBe('00000010');
        expect(type.ByteValue.twosComplement(-127)).toBe('10000001');
        expect(type.ByteValue.twosComplement(128)).toBe('10000000');
        expect(type.ByteValue.twosComplement(-128)).toBe('10000000');
      });
    
      it('should overflow Java style', function () {
        testValue = new type.ByteValue(128);
        expect(testValue.get()).toBe(-128);
      });

    });

    describe('IntValue', function () {
      
      beforeEach(function () {
        testValue = new type.IntValue();
      });
      
      it('should satisfy common requirements for typed values', commonTypedValueTests);
      
      it('should have type `int`', function () {
        expect(testValue.getVavaType()).toBe('int');
      });
      
      it('should have value 0 by default', function () {
        expect(testValue.get()).toBe(0);
      });
      
      it('should have value 5 if 5 is given', function () {
        testValue = new type.IntValue(5);
        expect(testValue.get()).toBe(5);
      });

      it('should compute on add message', function () {
        var aValue = new type.IntValue(5);
        var bValue = new type.IntValue(3);
        expect(aValue.add(bValue).get()).toBe(8);
      });

      it('should compute on subtract message', function () {
        var aValue = new type.IntValue(5);
        var bValue = new type.IntValue(3);
        expect(aValue.subtract(bValue).get()).toBe(2);
      });

      it('should compute on multiplication message', function () {
        var aValue = new type.IntValue(5);
        var bValue = new type.IntValue(3);
        expect(aValue.times(bValue).get()).toBe(15);
      });

      it('should compute on integer division message', function () {
        var aValue = new type.IntValue(5);
        var bValue = new type.IntValue(3);
        expect(aValue.divide(bValue).get()).toBe(1);
      });

    }); // end IntValue
    
  }); // end Typed values
  
}); // end Vava Types
