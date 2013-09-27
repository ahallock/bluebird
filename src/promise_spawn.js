var PromiseSpawn = (function() {

function PromiseSpawn( generatorFunction, caller ) {
    this._resolver = Promise.pending( caller );
    this._generatorFunction = generatorFunction;
    this._generator = void 0;
    this._caller = caller;
}
var method = PromiseSpawn.prototype;

method.promise = function PromiseSpawn$promise() {
    return this._resolver.promise;
};

method._run = function PromiseSpawn$_run( caller ) {
    ASSERT( this._generator === void 0 );
    ASSERT( typeof this._generatorFunction === "function" );
    this._generator = this._generatorFunction();
    this._generatorFunction = void 0;
    this._next( void 0, caller );
};

method._continue = function PromiseSpawn$_continue( result, caller ) {
    ASSERT( typeof this._generator === "object" );
    ASSERT( this._generatorFunction === void 0 );
    ASSERT( this.promise().isPending() );

    if( result === errorObj ) {
        this._resolver.reject( result.e );
        return;
    }

    var value = result.value;
    if( result.done ) {
         this._resolver.fulfill( value );
    }
    else {
        Promise.cast( value, caller )._then(
            this._next,
            this._throw,
            void 0,
            this,
            caller,
            caller
        );
    }
};

method._throw = function PromiseSpawn$_throw( reason, caller ) {
    ASSERT( typeof this._generator === "object" );
    ASSERT( this._generatorFunction === void 0 );
    ASSERT( this.promise().isPending() );

    this._continue(
        tryCatch1( this._generator["throw"], this._generator, reason ),
        caller
    );
};

method._next = function PromiseSpawn$_next( value, caller ) {
    ASSERT( typeof this._generator === "object" );
    ASSERT( this._generatorFunction === void 0 );
    ASSERT( this.promise().isPending() );

    this._continue(
        tryCatch1( this._generator.next, this._generator, value ),
        caller
    );
};



return PromiseSpawn;})();