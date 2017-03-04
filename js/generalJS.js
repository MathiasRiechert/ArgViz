/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */




//Tags:

var tags = {"NotIncluded": "Nicht empfohlen",
    "Included": "Empfohlen",
    "Schale": "Empfohlen als Schale",
    "Extended": "Empfohlen für spätere Erweiterung",
    "Task": "^_ld^task_",
    "DifferenzUniAUF": "Differenz-UniAUF",
    "AbstErweiterungsteil": "Abstimmung-Erweiterungsteil",
    "WR-empfohlenFuerKern": "WR-empfohlenFuerKern",
    "WR-empfohlenFuerErweiterungsteil": "WR-empfohlenFuerErweiterungsteil",
    "Destatis-sinnhaft": "Destatis-sinnhaft",
    "Destatis-detaillierter": "Destatis-detaillierter",
    "Destatis-generierbar": "Destatis-generierbar",
    "Destatis (wörtlich)": "Destatis (wörtlich)"

};
var mousedowntime; //is set to determine, if it was a window move click or a selection click
var mousedownX;
var mousedownY;

var settings = {
    general: {
        navigationMenu: {
            rowheight: 15,
            iconwidth: 15,
            spacingmin: 5,
            statustext: 50,
            circlefill: "#EEEEEE"
        }

    }

};
var texts = {
    Tags: {NotIncluded: "Nicht empfohlen",
        Included: "Empfohlen",
        Schale: "Optional",
        Extended: "Empfohlen für spätere Erweiterung",
        DifferenzUniAUF: "Differenz Uni-AUF",
        WRempfohlenFuerKern: "WR: Empfohlen als Kern",
        WRempfohlenFuerErweiterungsteil: "WR: Empfohlen als Erweiterung",
        Destatissinnhaft: "Destatis: sinnhaft",
        Destatisdetaillierter: "Destatis: detaillierter",
        Destatisgenerierbar: "Destatis: generierbar",
        Destatiswörtlich: "Destatis (wörtlich)"},
    Status: {Ausdiff: "Ausdifferenzierung",
        AusdiffShort: "Ausdiff.",
        Aggregationsniveau: "Aggregationsniveau",
        AggregationsniveauShort: "Aggr.niv.",
        Auspraegung: "Ausprägung",
        AuspraegungShort: "Auspräg.",
        Bereich: "Bereich",
        Kerndatum: "Kerndatum",
        KerndatumShort: "Kerndat.",
        ProArg: "Pro-Argument",
        ConArg: "Kontra-Argument"
    },
    Menu: {Definition: "Definition:"

    }
};





var cTEmpfohlen = "#006600", //for Texts
        cTErweiterungsteil = "#CC6600",
        cTNichtEmpfohlen = "#800000";
var transparencyNotFocused = 0.15;
var focusArea = {"NoFocus": 0, "NearFocus": 1, "DirectFocus": 2};

var circleSelected = false; // Those variables are used to enable the selection mode 
var focusCol = null;
var focus = null;

function getElementTypeTextFromNode(d, returnAbbreviation) {
    var short = false;
    if (returnAbbreviation !== undefined)
    {
        short = true;
    }
    var returntext = "";
    if (d.Nodetype == 10) {
        if (!short) {
            returntext = texts.Status.Aggregationsniveau;
        } else {
            returntext = texts.Status.AggregationsniveauShort;
        }
    }
    if (d.Nodetype == 9) {
        if (!short) {
            returntext = texts.Status.Auspraegung;
        } else {
            returntext = texts.Status.AuspraegungShort;
        }
    }
    if (d.Nodetype == 4) {
        if (!short) {
            returntext = texts.Status.Ausdiff;
        } else {
            returntext = texts.Status.AusdiffShort;
        }
    }
    if (d.level == 1) {
        returntext = texts.Status.Bereich;
    }
    if (d.level == 3) {
        if (!short) {
            returntext = texts.Status.Kerndatum;
        } else {
            returntext = texts.Status.KerndatumShort;
        }
    }
    return returntext;
}

//#############General Functions:
function updatedetails(d, parent) {
    var parentname; //parent is optional, only provided for Arguments
    if (typeof parent !== "undefined") {
        parentname = parent.name;
    }
    else
    {
        parentname = "";
    }
    
    if (d.Nodetype == 6 || d.Nodetype == 7) { //Bei Argumenten (Kein Deftext, sondern nur langer Name)

        //$$("TA_name").setValue(parentname);
        $("[view_id='itemtitle']").html("<div class=' webix_template'><table id='Titletable'><tr><td>" + getIconAsHtml(d) + "</td><td>" + parentname + "</td></tr></table></div>");
        $$("label_definition").setValue(d.Nodetype == 6 ? texts.Status.ProArg + ":" : texts.Status.ConArg + ":");
        $$("NavigationArea").setHTML( d.name);
        
           var heightContainer=$("[view_id='details-container']")[0].clientHeight;
           //ziehe die Höhe der Labelline ab:
           heightContainer=heightContainer-$("[view_id='details-labelline']")[0].clientHeight;
           //ziehe die headerhöhe ab:
           heightContainer=heightContainer-$("[view_id='details-header']")[0].clientHeight;
           //ziehe die Überschrift ab:
           heightContainer=heightContainer-$("[view_id='label_definition']")[0].clientHeight;
            $("[view_id='TA_definition']").html("<div style='height:"+heightContainer+"px;' id='TA_definition'>"+d.name+" </div>");

        
    }
    else
    {
        $$("label_definition").setValue(texts.Menu.Definition);
        //first replace <linkstart> by a href:
        var definitiontext = AddLinkInteraction(d.Nodedefinition);
        //then replace newline by <br>:
        definitiontext = definitiontext.replace(/(?:\r\n|\r|\n)/g, '<br />');

     var heightContainer=$("[view_id='details-container']")[0].clientHeight;
           //ziehe die Höhe der Labelline ab:
           heightContainer=heightContainer-$("[view_id='details-labelline']")[0].clientHeight;
           //ziehe die headerhöhe ab:
           heightContainer=heightContainer-$("[view_id='details-header']")[0].clientHeight;
           //ziehe die Überschrift ab:
           heightContainer=heightContainer-$("[view_id='label_definition']")[0].clientHeight;
            $("[view_id='TA_definition']").html("<div style='height:"+heightContainer+"px;' id='TA_definition'>"+definitiontext+" </div>");


        // $$("TA_name").setValue(d.name);
        var selectedText="";
        if (focusCol != null || circleSelected==true) {selectedText=" (fokussiert)";}
        $("[view_id='itemtitle']").html("<div class=' webix_template'><table id='Titletable'><tr><td>" + getIconAsHtml(d) + "</td><td>" + d.name + selectedText+ "</td></tr></table></div>");
    }

    $$("TA_type").setValue(getElementTypeTextFromNode(d)); //Sets the type text based on the elements properties


    var included;

    if ($.inArray(tags.Extended, d.tags) >= 0)
    {
        included = texts.Tags.Extended;
    }
    else if ($.inArray(tags.Schale, d.tags) >= 0)
    {
        included = texts.Tags.Schale;
    }
    else if ($.inArray(tags.Included, d.tags) >= 0)
    {
        included = texts.Tags.Included;
    }
    else if ($.inArray(tags.NotIncluded, d.tags) >= 0)
    {
        included = texts.Tags.NotIncluded;
    }
    else {
        included = "";
    }

    $$("TA_status").setValue(included);

    // console.log(d);

    //  $$("TA_Con").clearAll();
    // $$("TA_Pro").clearAll();

    /* if (d.NodeArguments) {
     d.NodeArguments.forEach(function(arg) {
     // console.log(arg.name);
     var test = arg.name;
     if (arg.Nodetype === "7")
     {
     $$("TA_Con").add({property: test});
     }
     else if (arg.Nodetype === "6")
     {
     $$("TA_Pro").add({property: test});
     }
     });
     }*/


    //update the navigation path:
    if (d.Nodetype == 6 || d.Nodetype == 7) {
        $$("NavigationArea").setHTML(updateNavigationHTML(parent));
    } else {
        $$("NavigationArea").setHTML(updateNavigationHTML(d));
    }

}

function getPathElementChain(d) {
    var elementchain = [];

    var currentelement = d;
    var levelback = 0;


    while (levelback <= 35 && currentelement.parent !== undefined && currentelement.parent !== null) {
        elementchain[levelback] = currentelement;
        levelback = levelback + 1;
        currentelement = currentelement.parent;

    }
    elementchain[levelback] = currentelement; //also add core element
    elementchain.reverse();
    return elementchain;
}


jQuery.fn.d3Click = function (furtherjumpIDchain) {

    this.each(function (i, e) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        e.dispatchEvent(evt);

    });


};

function updateNavigationHTML(d) {
    //first get a chain of connected elements:

    elementchain = getPathElementChain(d);
    var table = "<table width='100%'>";

    for (inti = 0; inti < elementchain.length; inti++) {
        table = table + '<tr><td width="3%" valign="top"><span style="font-size:0.9em;">&rdsh;</span></td><td width="90%"><a href="javascript:$(\'#' + elementchain[inti].id + '\').d3Click();">' + elementchain[inti].name + '</a></td><td width="10%"><span style="font-size:0.8em; color:#AAAAAA;">' + getElementTypeTextFromNode(elementchain[inti], true) + '</span></td></tr>';
    }
    table = table + "</table>";

    return table;
}


//## Math Functions:
function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function circleIntersection(x0, y0, r0, x1, y1, r1) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy * dy) + (dx * dx));

    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.  
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

    /* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a / d);
    y2 = y0 + (dy * a / d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((r0 * r0) - (a * a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h / d);
    ry = dx * (h / d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    return [xi, xi_prime, yi, yi_prime];
}



function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
//#############Drawing functions:
function bezier(source_point, control_point, target_point)
{

    var pathinfo = [source_point, control_point, target_point];
    var d3line2 = d3.svg.line()
            .x(function (d) {
                return d.x;
            })
            .y(function (d) {
                return d.y;
            })
            //.interpolate("linear"); //linear edges!
            .interpolate("basis");


    return d3line2(pathinfo);
}

//#############ZOOM:
function zoom() {
    vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var zoomListener = d3.behavior.zoom()
        .scaleExtent([0, Infinity])
        .on("zoom", zoomHandler);

var zoomListenerProcess = d3.behavior.zoom()
        .scaleExtent([0, Infinity])
        .on("zoom", zoomHandlerProcess);

function zoomHandlerProcess() {
    visproc.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var zoomFactor = 4;

function zoomHandler() {
  
    vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    
   
}

function appendParentToAllNodes(currentNode) {
    if (currentNode.children !== undefined) {
        currentNode.children.forEach(function (childnode) {
            childnode.parent = currentNode;
            //Additionally set the parent property for all alternative nodes:
            childnode.NodeAlternatives.forEach(function (alternativeObject) {
                alternativeObject.parent = currentNode;
                //no need for further recursion, as alternative objects never have children
            });


            appendParentToAllNodes(childnode);
        });
    }


}
function appendSearchIDToAllNodes(currentNode, hierarchyID) {
    var nexthierarchyID;
    if (hierarchyID === null || hierarchyID === undefined || hierarchyID === "") {
        nexthierarchyID = cutUntil(currentNode.name, " ");
    } else {
        nexthierarchyID = hierarchyID + "-" + cutUntil(currentNode.name, " ");
    }
    currentNode.id = nexthierarchyID;
    if (currentNode.NodeAlternatives !== undefined && currentNode.NodeAlternatives !== null) {
        //Additionally set the parent property for all alternative nodes:
        currentNode.NodeAlternatives.forEach(function (alternativeObject) {
            if (hierarchyID === null || hierarchyID === undefined || hierarchyID === "") {
                alternativeSearchID = cutUntil(alternativeObject.name, " ");
            } else {
                alternativeSearchID = hierarchyID + "-" + cutUntil(alternativeObject.name, " ");
            }
            alternativeObject.id = alternativeSearchID;
            //no need for further recursion, as alternative objects never have children
        });
    }


    if (currentNode.children !== undefined && currentNode.children !== null) {
        currentNode.children.forEach(function (childnode) {



            appendSearchIDToAllNodes(childnode, nexthierarchyID);
        });
    }

}
function cutAfter(text, delimiter) {
    var spacePos = text.indexOf(delimiter);
    if (spacePos === -1)
    {
        return text;
    }
    else
    {
        return text.substr(spacePos + 1);
    }

}

function cutUntil(text, delimiter) {
    var spacePos = text.indexOf(delimiter);
    if (spacePos === -1)
    {
        return text;
    }
    else
    {
        return text.substr(0, spacePos);
    }

}

function jumpToElementIfSpecified()
{
    if (selectedslide == 0) {
        return;
    }
    //lastly, navigate to the selected element from the other mode, if there is one:
    //For this, only 1 element can be clicked at a time --> therefore, the whole tree has to be clicked through:

    //we use two global variables for that: recentID and recentIDtemp. recentID holds the long id chain. recentIDtemp always gets the text already cut

    if (typeof recentIDtemp !== 'undefined' && recentID !== "Kerndatensatz" && recentIDtemp !== null && recentID !== null) {

        if (recentIDtemp !== recentID) { //repeat until they are the same
            var minuscorrection = 0;
            var rest_of_text = recentID.substring(recentIDtemp.length);
            if (rest_of_text.substring(0, 1) === "-") {
                rest_of_text = rest_of_text.substring(1);
                minuscorrection = 1;
            }
            var posMinus = rest_of_text.indexOf("-");
            if (posMinus > 0)
            {
                recentIDtemp = recentID.substring(0, parseInt(posMinus) + parseInt(recentIDtemp.length) + minuscorrection);
            }
            else
            {
                recentIDtemp = recentID;
            }
            if (recentIDtemp!=null && recentIDtemp!="null"){
            if (filtered(d3.select('#' + recentIDtemp)[0][0].__data__) == 0 && parentfiltered(d3.select('#' + recentIDtemp)[0][0].__data__) == 0)
            {
                $('#' + recentIDtemp).d3Click();
            }
            }

        }

    }
}

rootSvg = d3.select("#chart");
zoomListener(rootSvg);
//rootSvg.on("mousedown", function() {mousedowntime=+new Date();});
rootSvg.on("dblclick.zoom", null);

//additionally add Zoom and Pan for the process div:
processDiv = d3.select("#process_chart");
zoomListenerProcess(processDiv);


/* $(document).mousedown(function() {
 $(this).data('mousedown', true);
 });
 $(document).mouseup(function() {
 $(this).data('mousedown', false);
 });
 
 $(document).mousemove(function(e) {
 if($(this).data('mousedown')) {
 mousedowntime=+new Date(); mousedownX=e.pageX; mousedownY=e.pageY;
 }
 });*/
d3.select("body").on("mousedown", function () {
    mousedowntime = +new Date();
    mousedownX = d3.event.pageX;
    mousedownY = d3.event.pageY;
});

function getIconAsHtml(d) {
    var htmltext = "";
    if (d.Nodetype == 10 || d.Nodetype == 9 || d.Nodetype == 4) {

        htmltext = "<img src='Icons/";

        if (d.Nodetype == 10) {
            htmltext = htmltext + "Aggregationsniveau.png' alt='Aggregationsniveau' title='Aggregationsniveau'";
        }
        else if (d.Nodetype == 9) {
            htmltext = htmltext + "Ausdifferenzierung.png' alt='Ausdifferenzierung' title='Ausdifferenzierung'";

        }
        else if (d.Nodetype == 4) {
            if (d.level == 1) {
                htmltext = htmltext + "Bereich.png' alt='Bereich' title='Bereich'";
            }
            else if (d.level == 3) {
                htmltext = htmltext + "Kerndatum.png' alt='Kerndatum' title='Kerndatum'";
            }
            else
            {
                htmltext = htmltext + "Ausdifferenzierung.png' alt='Ausdifferenzierung' title='Ausdifferenzierung'";
            }

        }
        else
        {
            //return icon_kerndatum;  
        }
        htmltext = htmltext + " style='height:17px;width:17px; vertical-align:middle;'>";
    }
    return htmltext;
}

function CheckSelectionClick() {
    //if it is an automated click (no e) --> return false
    if (d3.event==null||( d3.event.clientX==0 && d3.event.clientY== 0)) {return false;}
    //console.log(d3.event);
    var now = +new Date();
    var diff = now - mousedowntime;
    var diffx = Math.abs(d3.event.pageX - mousedownX);
    var diffy = Math.abs(d3.event.pageY - mousedownY);

    // don't use mousedowntime, but instead check if x and y changed considerably
    //if (diff>400) {return true;}  //exit function if it was a panning click, instead of a selection click
    //console.debug (diffx + ":" + diffy);
    if (diffx > 4 || diffy > 4) {
        
        return true;
    }
}

function     AddLinkInteraction(strdefinition) {

    var startpos = strdefinition.indexOf("{linkstart}");
    if (startpos == -1)
    {
        return strdefinition;
    }

    var rest = strdefinition.substring(startpos);
    var endpos;
    endpos = strdefinition.indexOf("{linkend}");

    var ersterteil = strdefinition.substring(0, startpos);
    var mittelteil = strdefinition.substring(startpos + 11, endpos);
    var endteil = strdefinition.substring(endpos + 9);
    return ersterteil + "<b><a href='" + mittelteil + "' target='_blank'>" + mittelteil + "</a></b>" + endteil;

}

function filtered(node) {
    var codearray = jQuery.makeArray(node.tags);

    if ($.inArray(tags.Extended, codearray) >= 0)
    {
        if (visshowerweiterungsteil == 1) {
            return 0;
        }
    }
    else if ($.inArray(tags.NotIncluded, codearray) >= 0)
    {
        if (visshownichtempfohlen == 1) {
            return 0;
        }
    }
    else if ($.inArray(tags.Schale, codearray) >= 0)
    {
        if (visshowschale == 1) {
            return 0;
        }
    }

    else if ($.inArray(tags.Included, codearray) >= 0)
    {
        if (visshowempfohlen == 1) {
            return 0;
        }
    }

    return 1;

}

function parentfiltered(node) {

    var tempparent = node.parent;
    while (tempparent != null)
    {
        if (filtered(tempparent) == 1)
        {
            return 1;
        }
        tempparent = tempparent.parent;
    }
    return 0;
}

function getRoot(d) {
    while(d.parent) {
        d=d.parent;
    }
    return d;
}
jQuery.fn.d3Click = function (furtherjumpIDchain) {

    this.each(function (i, e) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        e.dispatchEvent(evt);

    });


};
function showDragPointer(source){
    $(source).css('cursor', 'move');
}

function hideDragPointer(source){
     if ($(source).hasClass("node")||$(source).hasClass("node_colTree")) {
        $(source).css('cursor', 'pointer');
    }
    else
    { $(source).css('cursor', 'auto');}
}