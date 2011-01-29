var VavaClass = exports.VavaClass = function (vavaClassName, vavaClassDefinition, scope) {
  
  this.vavaClassName = vavaClassName;
  this.scope = scope.__descend(vavaClassDefinition.fields);
  this.scope.__class = this;
  this.vavaMethods = vavaClassDefinition.methods || [];
  
  setModifiers(this, vavaClassDefinition.vavaModifiers);
  
};


/**
 * Sends the class a message to call its method of the provided name.
 *
 * @param methodName Name of the method to call
 * @param params Parameters to pass
 */
VavaClass.prototype.send = function (methodName, params) {
  return this.vavaMethods[methodName].call(this.scope, params);
};

function setModifiers (classInstance, modifierOptions) {
  modifierOptions = modifierOptions || {};
  classInstance.vavaVisibility = modifierOptions.vavaVisibility || 'default';
}
