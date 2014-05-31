
var Example = function( name, loadcb, rec ){
   this.name = name;
   this.loadcb = loadcb;
   this.recursions = rec;
}
Example.prototype.load = function(){
   draw_variables = [];
   constants = [];
   rules = [];
   control_variables = [];
   this.loadcb();
}

var   selectElement = null;
var   recursionsElement = null;

function LoadExamples( select, rec_selector ){
   examples["example2"] = new Example( "example2", LoadExample_2, 5 );
   examples["example5"] = new Example( "Sierpinski Triangle", LoadExample_5, 6 );
   examples["example6"] = new Example( "Dragon Curve", LoadExample_6, 10 );
   
   recursionsElement = document.getElementById( rec_selector );
   selectElement = document.getElementById( select );
   for( var key in examples ){
      var opt = document.createElement( "option" );
      var e = examples[key];
      opt.value = key;
      opt.innerHTML = e.name;
      selectElement.appendChild( opt );
   }
   $(selectElement).change(function(){
      var id = GetExampleID();
      recursionsElement.value = id == null ? 4 : examples[id].recursions;
   });
   
   var id = GetExampleID();
   recursionsElement.value = id == null ? 4 : examples[id].recursions;
}

function GetExampleID(){
   if( selectElement.selectedIndex == -1 )
      return null;
   return selectElement.options[ selectElement.selectedIndex ].value;
}

function GetExampleRecursions(){
   if( recursionsElement.value < 0 || recursionsElement.value > 30 )
      recursionsElement.value = 4;
   return recursionsElement.value;
}

function LoadExample_2(){
   lrecursions = 3;
   laxiom = "0";
   rules["1"] = "11";
   rules["0"] = "1[-0]+0";
   draw_variables = [ "0", "1" ];
   constants = [];
   constants["["] = function(){ turtle.pushStack(); };
   constants["]"] = function(){ turtle.popStack(); };
   constants["+"] = function(){ turtle.turnRight( 45 ); };
   constants["-"] = function(){ turtle.turnLeft( 45 ); };
}

function LoadExample_5(){
   lrecursions = 5;
   laxiom = "A";
   rules["A"] = "B-A-B";
   rules["B"] = "A+B+A";
   draw_variables = [ "A", "B" ];
   constants["+"] = function(){ turtle.turnRight( 60 ); };
   constants["-"] = function(){ turtle.turnLeft( 60 ); };
}

function LoadExample_6(){
   lrecursions = 10;
   laxiom = "FX";
   rules["X"] = "X+YF";
   rules["Y"] = "FX-Y";
   draw_variables = [ "F" ];
   control_variables = [ "X", "Y" ];
   constants["+"] = function(){ turtle.turnRight( 90 ); };
   constants["-"] = function(){ turtle.turnLeft( 90 ); };
}







