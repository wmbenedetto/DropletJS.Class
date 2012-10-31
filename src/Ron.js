/**
 *     ____  ____  _   __     _______
 *    / __ \/ __ \/ | / /    / / ___/
 *   / /_/ / / / /  |/ /__  / /\__ \
 *  / _, _/ /_/ / /|  // /_/ /___/ /
 * /_/ |_|\____/_/ |_(_)____//____/
 *
 * "You stay classy, JavaScript."
 *
 * Ron.js : Simple Classical Inheritance for JavaScript
 *
 * Copyright (c) 2012 Warren Benedetto <warren@transfusionmedia.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window, undefined){

    var Class = {

        /**
         * Extends method by providing access to parent method from within child
         * method via this._parent[methodName];
         *
         * @param methodName The name of the method to extend
         * @param parentMethod The parent method being extended
         * @param childMethod The child method extending the parent
         * @return {Function}
         */
        extendMethod : function(methodName,parentMethod,childMethod){

            return function(){

                var self                            = this;
                this._parent                        = {};

                /* Provide access to parent via this._parent[methodName], while making
                 * sure that "this" refers to the child instance */
                this._parent[methodName] = function(){

                    var parentArgs                  = Array.prototype.slice.call(arguments);

                    try {
                        delete self._parent;
                    } catch (e){
                        self._parent                = undefined;
                    }

                    /* Return result of parent method, called in the scope of the child instance */
                    return parentMethod.apply(self,parentArgs);
                };

                var args                            = Array.prototype.slice.call(arguments);

                /* Return result of child function */
                return childMethod.apply(this,args);
            }
        },

        /**
         * Creates instance-specific copies of any class properties which are objects or arrays.
         *
         * When the class is created, all properties are added to the prototype. This is fine
         * for strings, numbers, booleans, etc. When their values are set on a class instance,
         * the value becomes a property of that instance only. Objects (and arrays) are different.
         * When you modify an object, the change is not made only to the single instance. Instead,
         * the prototype itself is modified. The result is that modifying an object in one class
         * instance ends up modifying that object in ALL classes' instances.
         *
         * To overcome this, we create a temporary object, copy the prototype object's properties
         * into it, then assign the class instance property to that object. The end result is
         * that the class instance has an instance-specific copy of the object, allowing it to be
         * modified without affecting any other instances.
         *
         * @param ClassInstance The class instance
         */
        createInstanceObjects : function(ClassInstance){

            for (var prop in ClassInstance){

                if (typeof ClassInstance[prop] === 'object' && ClassInstance[prop] !== null){
                    ClassInstance[prop] = this.copyObj(ClassInstance[prop]);
                }
            }
        },

        /**
         * Recursively creates deep copy of an object/array
         *
         * @param source The source object/array to copy
         */
        copyObj : function(source){

            var copy                    = (typeof source.length === 'number') ? [] : {};

            for (var i in source){
                copy[i]                 = (typeof source[i] === 'object' && source[i] !== null) ? this.copyObj(source[i]) : source[i];
            }

            return copy;
        },

        /**
         * Checks whether all interfaces are properly and fully implemented in the
         * ClassInstance's prototype
         *
         * @param ClassInstance The instance for which to implement the interface
         * @param interfaces The interface(s) to implement
         * @return {Function}
         */
        checkInterfaces : function(ClassInstance,interfaces){

            for (var i=0;i<interfaces.length;i++){

                for (var prop in interfaces[i]){

                    if (interfaces[i].hasOwnProperty(prop)){

                        if (typeof ClassInstance.prototype[prop] === 'undefined'){

                            throw new Error('Interface not fully implemented: "'+prop+'" '+typeof interfaces[i][prop]+' is missing');

                        } else if (typeof interfaces[i][prop] !== typeof ClassInstance.prototype[prop]){

                            throw new Error('Interface improperly implemented. "'+prop+'" property must be a '+typeof interfaces[i][prop]);
                        }
                    }
                }
            }

            return ClassInstance;
        }
    };

    var ClassFactory                    = function(){};

    /**
     * Creates new class based on definition object
     *
     * @param definition Object defining class properties and methods
     * @return {Function}
     */
    ClassFactory.create = function(definition){

        function ClassInstance(){

            this.CLASS_ID               = ('' + Math.random() + new Date().getTime()).substr(10);

            Class.createInstanceObjects(this);

            /* Each class can have an optional construct() method which
             * receives the arguments from the instantiated class. So if you did:
             *
             * var warren = new Person('sexy','rich','delusional');
             *
             * ... then 'sexy','rich' and 'delusional' would be passed to construct().
             */
            if (typeof this.construct === 'function'){
                this.construct.apply(this,Array.prototype.slice.call(arguments));
            }
        }

        ClassInstance.prototype         = definition;

        ClassInstance.implement = function(){
            return Class.checkInterfaces(this,Array.prototype.slice.call(arguments));
        };

        return ClassInstance;
    };

    /**
     * Extends class, adding the child class definition to the parent class
     * prototype and extending any parent methods
     *
     * @param parent The parent to extend
     * @param definition The child class definition
     * @return {*}
     */
    ClassFactory.extend = function(parent,definition){

        var ClassInstance                       = ClassFactory.create(definition);

        function ParentInstance(){}

        ParentInstance.prototype                = parent.prototype;
        ClassInstance.prototype                 = new ParentInstance();
        ClassInstance.prototype.constructor     = ClassInstance;

        for (var prop in definition){

            if (definition.hasOwnProperty(prop)){

                if (typeof definition[prop] === 'function' && typeof parent.prototype[prop] === 'function'){

                    definition[prop]            = Class.extendMethod(prop,parent.prototype[prop],definition[prop]);
                }

                ClassInstance.prototype[prop]   = definition[prop];
            }
        }

        return ClassInstance;
    };

    window.Ron = ClassFactory;

}(window));