# You stay classy, JavaScript

Ron.js is a simple implementation of classical inheritance for JavaScript. It allows you to extend classes and implement simple interfaces, all with a clean, simple syntax.

## Usage

### Creating a class

To create a new class, you simply call Ron.create() and pass it an object literal containing the class properties and methods.

If you include a `construct` method, it will automatically be called when the class is instantiated.

```javascript
/**
 * Create a new Person class
 */
var Person = Ron.create({

    /**
     * Class properties
     */
    firstName               : '',
    lastName                : '',

    /**
     * Constructor. Automatically called when class is instantiated.
     *
     * @param data Data object
     */
    construct : function(data){

        console.log('This data was passed in to the Person constructor: ',data);

        data                = data || {};
        this.firstName      = data.firstName || '';
        this.lastName       = data.lastName  || '';
    },

    /**
     * Class method
     */
    work : function(){
        console.log("Person.work(): Every day I'm hustlin'");
    }
});
```

### Extending a class

To extend a class, you call Ron.extend() and pass it a reference to the class you want to extend, as well as an object literal containing any methods or properties with which you want to extend it.

As with any classical inheritance, the child class can override the parent class' properties and methods. Any properties and methods that aren't overridden are inherited.

Parent methods that have been overridden can be accessed from within the overriding method using `this._parent.methodName()`.

In the example below, the `construct` method is overridden. However, the parent class' `construct` method can still be accessed by calling `this._parent.construct()` from within `construct`.

```javascript
/**
 * Extend the Person class to create an Actor class
 */
var Actor = Ron.extend(Person,{

    /**
     * Subclass property. Class properties from Person
     * are inherited.
     */
    movies                  : [],

    /**
     * Subclass method overrides parent class method, but parent
     * class method is still accessible via this._parent.construct()
     *
     * @param data Data object
     */
    construct : function(data){

        console.log('This data was passed in to the Actor constructor: ',data);

        /* Parent class methods that have been overridden can be called using this._parent.methodName() */
        this._parent.construct(data);

        this.movies         = data.movies || [];
    },

    /**
     * Subclass method completely overrides parent class method
     */
    work : function(){
        console.log(this.firstName+' '+this.lastName+" says \"To be or not to be? That is the question.\"");
    },

    /**
     * New method extends parent class functionality
     */
    brag : function(){

        for (var i=0;i<this.movies.length;i++){
            console.log('I was in "'+this.movies[i]+'"')
        }
    }
});
```

### Instantiating classes

Once a class has been created, instances can be created via the `new` keyword.

```javascript
/* Instantiate a new Person */
var person = new Person({
    firstName : 'Warren',
    lastName : 'Benedetto'
});

/* Instantiate a new Actor */
var actor = new Actor({
    firstName : 'Brad',
    lastName : 'Pitt',
    movies : [
        'Seven',
        'Troy',
        'Moneyball'
    ]
});

person.work();  // Warren Benedetto says "Every day I'm hustlin'" 
actor.work();   // Brad Pitt says "To be or not to be? That is the question." 

actor.brag();
/*
I was in "Seven" 
I was in "Troy" 
I was in "Moneyball" 
*/
```

## Questions? Bugs? Suggestions?

Please submit all bugs, questions, and suggestions via the [Issues](https://github.com/wmbenedetto/ron.js/issues) section so everyone can benefit from the answer.

If you need to contact me directly, email warren@transfusionmedia.com.

## MIT License

Copyright (c) 2012 Warren Benedetto <warren@transfusionmedia.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.