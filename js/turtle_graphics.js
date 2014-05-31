
var   MATH_PI = Math.atan( 1.0 ) * 4;
var   TO_RADS =  MATH_PI / 180;

var TurtleGraphics = function(){
   this.p = { x: 0, y: 0 };
   this.d = 270;
   this.stack = [];
}
TurtleGraphics.prototype.setPosition = function( x, y ){
   console.log( "Turtle::setPosition " + x + " " + y );
   this.p = { x: x, y: y };
}
TurtleGraphics.prototype.turnLeft = function( d ){ // 90 degrees
   this.d += d;
   if( this.d == 360 )
      this.d = 0;
}
TurtleGraphics.prototype.turnRight = function( d ){ // 90 degrees
   this.d -= d;
   if( this.d == -90 )
      this.d = 270;
}
TurtleGraphics.prototype.pushStack = function(){
   this.stack.push( { p: { x: this.p.x, y: this.p.y }, d: this.d } );
}
TurtleGraphics.prototype.popStack = function(){
   var o = this.stack.pop();
   this.p = o.p;
   this.d = o.d;
}
TurtleGraphics.prototype.rotate = function( x, y ){
   var radians = this.d * TO_RADS;
   var xx = x * Math.cos( radians ) - y * Math.sin( radians );
   var yy = x * Math.sin( radians ) + y * Math.cos( radians );
   return { x: xx, y: yy }
}
TurtleGraphics.prototype.drawForward = function( units ){
   var from = { x: this.p.x, y: this.p.y };
   var rot = this.rotate( 0, units );
   this.p.x += rot.x;
   this.p.y += rot.y;
   return { from: from, to: this.p };
}








