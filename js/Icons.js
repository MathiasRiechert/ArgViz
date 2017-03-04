var icon_aggregation; 
var icon_kerndatum; 
var icon_bereich; 
var icon_ausdifferenzierung;
icon_aggregation="<svg "
 + "  viewBox='0 0 40 40'"
 + "  height='20'"
 + "  width='20'"
+">"
 + " <g"
 + " transform='translate(0,-1022.3622)'"
 + " id='layer1'><title>Aggregationsniveau</title>"
 + " <ellipse"
 + " ry='3.2964664'"
 + " rx='3.2964666'"
 + " cy='1046.0944'"
 + " cx='5'"
 + " id='path3348'"
 + " style='fill:#ffffff;stroke:#000000;stroke-width:1.4070667' />"
 + " <ellipse"
 + " ry='3.2964664'"
 + " rx='3.2964666'"
 + " cy='1046.0944'"
 + " cx='15'"
 + " id='path3348-6'"
 + " style='fill:#ffffff;stroke:#000000;stroke-width:1.4070667' />"
 + " <ellipse"
 + " ry='3.2964664'"
 + " rx='3.2964666'"
 + " cy='1046.0942'"
 + " cx='25'"
 + " id='path3348-6-8'"
 + " style='fill:#ffffff;stroke:#000000;stroke-width:1.4070667' />"
 + " <circle"
 + " r='3.2964666'"
 + " cy='1028.9514'"
 + " cx='15'"
 + " id='path3348-6-80'"
 + " style='fill:#ffffff;stroke:#000000;stroke-width:1.40706682' />"
 + " <path"
 + " id='path3431'"
 + " d='m 15,1032.096 0,10.6698'"
 + " style='fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1' />"
 + " <path"
 + " d='m 4.7982246,1042.8289 0,-5.4927 20.2030504,0 0,5.3033'"
 + " style='fill:none;fill-rule:evenodd;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1' />"
 + " </g>"
 + " </svg>";
 
 icon_kerndatum="<svg  width='20' height='20' viewBox='0 0 40 40'>"
  + " <g"
 + " "
 + " ><title>Kerndatum</title>"
 + " <circle r='9.6380987' cy='15' cx='15' style='fill:#ffffff;stroke:#000000;stroke-width:0.72380233' />"
 + " <circle r='2.9927151' cy='15' cx='15' style='fill:#000000;stroke:#000000;stroke-width:1.01456964' />"
 + " </g></svg>"; 
 
icon_bereich="<svg  width='20'  height='20'  viewBox='0 0 35 35'><g><title>Bereich</title>"
 + "   <circle" 
 + "      r='9.6141615'" 
 + "      cy='15'" 
 + "      cx='15'" 
 + "      id='path3393'" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.77167654' />" 
 + "   <ellipse" 
 + "      ry='3.8431787'" 
 + "      rx='3.8475287'" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.28877848'" 
 + "      id='path3354'" 
 + "      cx='12.462092'" 
 + "      cy='10.714073' />" 
 + "   <ellipse" 
 + "      ry='3.8431787'" 
 + "      rx='3.8475287'" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.28877848'" 
 + "      id='path3354-8'" 
 + "      cx='20.037313'" 
 + "      cy='14.720149' />" 
 + "   <ellipse" 
 + "      ry='3.8431787'" 
 + "      rx='3.8475287'" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.28877848'" 
 + "      id='path3354-1'" 
 + "      cx='12.481343'" 
 + "      cy='19.197762' />" 
 + " </g></svg>" ;


icon_ausdifferenzierung="<svg width='20'  height='20' viewBox='0 0 35 35'>"
 +" <g><title>Ausdifferenzierung</title><g >"
 +" <path" 
 + "      id='path3433-5'" 
 + "      d='M 7.6196037,15.070459 21.415492,7.3733863'" 
 + "      style='fill:#333333;fill-rule:evenodd;stroke:#4c4c4c;stroke-width:0.33512676;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.62311557' />" 
 + "   <path" 
 + "      id='path3433-5-6'" 
 + "      d='M 7.6604354,15.281588 21.456323,22.978661'" 
 + "      style='fill:#333333;fill-rule:evenodd;stroke:#4c4c4c;stroke-width:0.33512676;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.62311557' />" 
 + "   <path" 
 + "      id='path3433-5-6-0'" 
 + "      d='M 7.6490446,15.04824 21.489144,15.04384'" 
 + "      style='fill:#333333;fill-rule:evenodd;stroke:#4c4c4c;stroke-width:0.33512676;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.62311557' />" 
 + "   <g" 
 + "      id='layer1' />" 
 + "   <ellipse" 
 + "      ry='4.8194423'" 
 + "      rx='4.8190494'" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.36191592'" 
 + "      id='path3354-1'" 
 + "      cx='6.6425266'" 
 + "      cy='14.999593' />" 
 + "   <ellipse" 
 + "      ry='1.4964795'" 
 + "      rx='1.4963576'" 
 + "      style='fill:#000000;stroke:#000000;stroke-width:0.5073055'" 
 + "      id='path3356-0'" 
 + "      cx='6.6425266'" 
 + "      cy='14.999593' />" 
 + "   <ellipse" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.30684847'" 
 + "      id='path3354-1-3'" 
 + "      cx='24.25'" 
 + "      cy='5.7711806'" 
 + "      rx='4.0965757'" 
 + "      ry='4.0753951' />" 
 + "   <ellipse" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.30684847'" 
 + "      id='path3354-1-3-4'" 
 + "      cx='24.25'" 
 + "      cy='15.021181'" 
 + "      rx='4.0965757'" 
 + "      ry='4.0753951' />" 
 + "   <ellipse" 
 + "      style='fill:#ffffff;stroke:#000000;stroke-width:0.30684847'" 
 + "      id='path3354-1-3-4-5'" 
 + "      cx='24.25'" 
 + "      cy='24.271181'" 
 + "      rx='4.0965757'" 
 + "      ry='4.0753951' />" 
 +"</g></svg>";