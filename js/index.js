
var TimerObject = function( ms, cb ){
   this.interval = ms;
   this.callback = cb;
   this.handle = null;
};
TimerObject.prototype.start = function(){
   var me = this;
   this.handle = setInterval(function(){ me.callback(me); }, me.interval );
}
TimerObject.prototype.stop = function(){
   clearInterval( this.handle );
}

var BoundingBox = function( x, y ){
   this.top = y;
   this.bottom = y;
   this.left = x;
   this.right = x;
}
BoundingBox.prototype.test = function( x, y ){
   if( x < this.left ) this.left = x;
   else if( x > this.right ) this.right = x;
   if( y < this.top ) this.top = y;
   else if( y > this.bottom ) this.bottom = y;
}
BoundingBox.prototype.size = function(){
   return { width: this.abs(this.right - this.left), height: this.abs(this.top - this.bottom) };
}
BoundingBox.prototype.abs = function( val ){
   return val < 0 ? -val : val;
}

var   k_stage = null;
var   k_layer = null;
var   k_group = null;
var   k_draggable_bg = null;
var   layerCount = 0;

var   DRAW_LENGTH = 5;
var   timer = new TimerObject( 0, DrawLSystem );
var   turtle = null;
var   width = parseInt( window.innerWidth * 1.0 );
var   height = parseInt( window.innerHeight * 1.0 );

var   examples = {};
var   laxiom = "0";
var   laxiom_index = 0;
var   lrecursions = 5;
var   rules = {};
var   draw_variables = [];
var   constants = {};
var   control_variables = [];
var   bbox = null;
var   example_id = "example6";

function PushKGroup(){
   if( k_group != null ){
      k_group.draw();
      
   }
   k_group = new Kinetic.Group({});
   k_layer.add( k_group );
   layerCount = 0;
}


$( document ).ready(function() {
   var cont = document.getElementById( "canvas_container" );
   cont.style.width = width + "px";
   cont.style.height = height + "px";
   
   k_stage = new Kinetic.Stage({
      container: 'canvas_container',
      width: width,
      height: height
   });
   
   $("#ui_box_menu_center").click(function(){

   });
   $("#ui_box_menu_draw").click(function(){
      LSystem_Stop();
      var id = GetExampleID();
      if( id == null ){
         console.log( "Error: invalid id - " + id );
         return;
      }
      examples[id].load();
      lrecursions = GetExampleRecursions();
      LSystem_Start();
   });
   $("#ui_box_menu_stop").click(function(){
      LSystem_Stop();
   });
   
   LoadExamples( "ui_examples_container_select", "ui_examples_container_rec" );
});

function LSystem_Start(){
   turtle = new TurtleGraphics();
   turtle.setPosition( k_stage.getWidth() / 2, k_stage.getHeight() / 2 );
   bbox = new BoundingBox( k_stage.getWidth() / 2, k_stage.getHeight() / 2 );
   
   k_stage.destroyChildren();
   k_draggable_bg = null;
   k_layer = new Kinetic.Layer({ draggable: true });
   k_stage.add( k_layer );
   PushKGroup();
   ResizeCanvasDraggable( bbox.size() );

   console.log( "recursions " + lrecursions );
   
   BuildAxiom();
   timer.start();
}

function LSystem_Stop(){
   timer.stop();
}

function ResizeCanvasDraggable( size ){
   if( k_draggable_bg != null ){
      k_draggable_bg.remove();
      k_layer.draw(); // draw current layer where draggable was to 'remove it'.
   }
      
   k_draggable_bg = new Kinetic.Rect({
       x: bbox.left - 200,
       y: bbox.top - 200,
       width: size.width + 400,
       height: size.height + 400,
       fill: "#555555",
       opacity: 0
   });
   bbox.test( bbox.left - 200, bbox.top - 200 );
   bbox.test( bbox.right + 200, bbox.bottom + 200 );
   
   k_layer.add( k_draggable_bg );
   k_draggable_bg.draw();
}

function LoadUI(){
   $("#view_port").panzoom({
      $reset: $("#ui_box_menu_center"),
      $zoomIn: $("#ui_box_menu_zoom_in"),
      $zoomOut: $("#ui_box_menu_zoom_out"),
      cursor: "default",
      minScale: 0.4,
      maxScale: 1,
   });
   
   var cont = document.getElementById( "view_port" );
   cont.style.left = ( ( window.innerWidth / 2 ) - ( k_stage.getWidth() / 2 ) ) + "px";
   cont.style.top = ( ( window.innerHeight / 2 ) - ( k_stage.getHeight() / 2 ) ) + "px";
}

function BuildAxiom(){
   laxiom_index = 0;
   for( var r = 0; r < lrecursions; r++ ){
      var a = "";
      for( var s = 0; s < laxiom.length; s++ ){
         var c = laxiom[s];
         if( c in rules ){
            a += rules[c];
         }
         else{
            a += c;
         }
      }
      laxiom = a;
   }
}

function DrawLSystem( caller ){
   if( laxiom_index >= laxiom.length ){
      timer.stop();
      console.log( "String empty" );
      return;
   }
   
   // check next command if this was turn command
   while( ExecuteCommand( laxiom[laxiom_index++] ) == 1 && laxiom_index < laxiom.length ){}
   //k_group.draw();
}

function ExecuteCommand( cmd ){
   if( cmd in constants ){
      constants[cmd]();
   }
   else if( $.inArray( cmd, control_variables ) >= 0 ){
      // just ignore
   }
   else if( $.inArray( cmd, draw_variables ) >= 0 ){
      var p = turtle.drawForward( DRAW_LENGTH );
      //console.log( p.from.x + ":" + p.from.y + " - " + p.to.x + ":" + p.to.y );
      Canvas_DrawLine( p );
      return 0;
   }
   else{
      throw "Wrong command";
   }
   return 1;
}

function Canvas_DrawLine( pos ){
   if( 
         ( pos.to.x < bbox.left || pos.to.x > bbox.right ) ||
         ( pos.to.y < bbox.top || pos.to.y > bbox.bottom ) 
      ){
      bbox.test( pos.to.x, pos.to.y );
      bbox.test( pos.from.x, pos.from.y );
      ResizeCanvasDraggable( bbox.size() );
   }
   var line = new Kinetic.Line({
      points: [ pos.from.x, pos.from.y, pos.to.x, pos.to.y ],
      stroke: 'black', strokeWidth: 1, lineCap: 'round', lineJoin: 'round',
      draggable: true
   });
   k_group.add( line );
   line.draw();
   if( layerCount++ == 150 )
      PushKGroup();
}









