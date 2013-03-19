* Null conveys intention, undefined error
* Everything acts like an object.
* An object is a series of properties.
* Properties consist of a name, some metadata about the property, and a value.
* Some values aren't objects, but try their hardest to act like objects. We
  call these values "primitives".
* Every function gets a static scope that defines a series of names.
* Every time a function is called, it creates a dynamic scope that maps values
  to the names from the static scope.
* Every time a function is called, it creates a runtime scope that maps `this`
  to the receiver of the function call, and `arguments` to an object that
  represents the arguments passed to the function call.
* Inside a function's scope, you can access any variable defined in any of the
  enclosing scopes -- but not their siblings.
* A function call's receiver is defined by looking at the left hand side of the
  place of where it's called. 
* You can modify a function's runtime scope using `func.call` and `func.apply`;
  and use these to modify `receiver` and `arguments`. 

