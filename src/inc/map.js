import VueCookies from 'vue-cookies'
import { EventBus } from '@/event-bus.js'
import SVG from 'svg.js';

let Map = () => {
  let dotsize = 4;
  let strokeWidth = 0.1;
  let draw = SVG('svg').size('100%', '300px');
  let svgGroup;
  let everything = draw.group();
  let centerLocation = { x: 0, y: 0 };
  let vehicle;    
  VueCookies.config('2y');
  if( VueCookies.get('scale')===null ){
    VueCookies.set('scale', 2);
  }
  let VIEWBOX = function(){
    setViewbox();
    function setViewbox(){
      let scale = VueCookies.get('scale');
      draw.viewbox({ 
        x: -50/scale, 
        y: -50/scale,
        width: 100/scale,
        height: 100/scale, 
      });
    }
    function zoomIn(){
      VueCookies.set('scale', VueCookies.get('scale') * 2);
      setViewbox();
      scaleElements();
    }
    function zoomOut(){
      VueCookies.set('scale', VueCookies.get('scale') / 2);
      setViewbox();
      scaleElements();
    }
    return{
      zoomIn: zoomIn,
      zoomOut: zoomOut,
    };

  }();
  function scaleElements(){
    let circles = SVG.select('circle');
    let abLines = SVG.select('line');
    let scale = VueCookies.get('scale');
    circles.each(function(){
      this.radius(dotsize/scale);
    });
  
    abLines.each(function(){
      this.stroke({width: strokeWidth/scale});
    });

    SVG.get('tractor_arrow').scale(1/scale);
  }

  function drawLinesAndABpoints(xyLines, xyPointA, xyPointB){
    let scale = VueCookies.get('scale');
    if(svgGroup != undefined){           
        svgGroup.remove();
    } 
    svgGroup = draw.group();
    drawSquares();
    
    svgGroup.add(
        draw.circle().radius(dotsize/scale).fill('#FFA500').cx(-xyPointA.x).cy(xyPointA.y)
    );
    svgGroup.add(
        draw.circle().radius(dotsize/scale).fill('#005AFF').cx(-xyPointB.x).cy(xyPointB.y)
    );
    xyLines.forEach(function(line){
        line = extLine(line);
        let svgline = draw.line(-line.A.x, line.A.y, -line.B.x, line.B.y).stroke({ color: '#000', width: strokeWidth/scale });
        svgGroup.add(svgline);
    });
    everything.add(svgGroup);
  }

  function drawSquares(){
    for (let x = -20; x <= 20; x++) {
      if(x%2==0){
          let square2 = draw.rect(450,10).cx(0).cy(x*10).fill('#f0f0f0').opacity(0.5);
          let square = draw.rect(10,450).cx(x*10).cy(0).fill('#f0f0f0').opacity(0.5);
          svgGroup.add(square);
          svgGroup.add(square2);
      }
    }
  }
    
  function drawClosestLine(closestLine){
    
      let scale = VueCookies.get('scale');
      let previousLine = SVG.get('closestLine');
      closestLine = extLine(closestLine);
      if(previousLine){
          previousLine.remove();
      }
      let line = draw.line(-closestLine.A.x, closestLine.A.y, -closestLine.B.x, closestLine.B.y)
      .stroke({ color: '#F00', width: strokeWidth/scale*3 })
      .id("closestLine");
      
      svgGroup.add(line);
      // console.log(closestLine);
  }

  function drawVehicle(x, y, driveBearing){
    let scale = VueCookies.get('scale');
    if(x === null || y === null){
        return;
    }
    if(vehicle != undefined){
        vehicle.remove();    
    }
    // vehicle = draw.circle(dotsize).fill('#904CAF').cx(x).cy(y);
    // console.log(driveBearing);
  
    vehicle = draw.polygon([[-4,-10],[0,0],[4,-10], [0,-8]]).cx(x).cy(y).fill('#f06').rotate(driveBearing).scale(1/scale).id("tractor_arrow");
    //console.log(svgGroup);
    if(svgGroup != undefined){ //fix small bug
      svgGroup.add(vehicle);
    }  
  }

  function rotateGroup(angle){
    if(svgGroup != undefined){
        // svgGroup.move(-centerLocation.x,-centerLocation.y).rotate(angle);
        svgGroup.rotate(angle, -centerLocation.x, -centerLocation.y);
    }          
  }

  let TRANSFORMSVGGROUP = (function(){
    let x;
    let y;
    let r;
    function transformSvgGroup(){
      if(x != undefined && y != undefined && r != undefined){
        svgGroup.translate(-x, -y);
        everything.rotate(r+180, 0, 0);
        // everything.scale(1);
      }        
    }
    function setPosition(xyCurrX, xyCurrY){
      x = xyCurrX;
      y = xyCurrY;
      transformSvgGroup();
    }
    function setRotation(rotation){
      r = rotation;
      transformSvgGroup();
    }
    return{
      setPosition: setPosition,
      setRotation: setRotation,
    };
  }());
   

  EventBus.$on('zoomIn', () => VIEWBOX.zoomIn());
  EventBus.$on('zoomOut', () => VIEWBOX.zoomOut());

  return {
    drawLinesAndABpoints: drawLinesAndABpoints,
    drawVehicle: drawVehicle,
    rotateGroup: rotateGroup,
    TRANSFORMSVGGROUP: TRANSFORMSVGGROUP,
    VIEWBOX: VIEWBOX,
    drawClosestLine: drawClosestLine
  };

}

// https://stackoverflow.com/questions/18113960/given-two-points-how-do-i-draw-a-line-through-them
function extLine(line) {
  let delta = 2;

  let x1 = line.A.x;
  let y1 = line.A.y;
  let x2 = line.B.x;
  let y2 = line.B.y;

  let ox1 = x1 + (x2 - x1) * -delta;
  let ox2 = x1 + (x2 - x1) * (1 + delta);
  let oy1 = y1 + (y2 - y1) * -delta;
  let oy2 = y1 + (y2 - y1) * (1 + delta);
  
  let output = {};
  output.A = {x: ox1, y: oy1};
  output.B = {x: ox2, y: oy2};

  return output;
}

export default Map;