$(document).ready(function () {
    $('#chart').mousedown(function () {

        $(this).css('cursor', 'move');
    });
    $('#chart').mouseup(function () {


        $(this).css('cursor', 'auto');
    });
   


});





if (vismode == 1 && selectedslide == 1)
{
    function showalternatives(d, i_t)
    {
        if (parseInt(visalternativesvis) !== 0)
        {

            var v = i_t; //get the target view  
            var k = diameter / v[2];
            var xtarget = (d.x - v[0]) * k;
            var ytarget = (d.y - v[1]) * k;
            var rtarget = (d.r * k + 2) + 6;
            //degree = 360°/number of alternatives
            //distance between circles=r of center * 2 +margin
            var distance = rtarget + rtarget / 6 + 50;
            var ialts = d.NodeAlternatives.length;
            i = 0;
            d.NodeAlternatives.forEach(function (alternativeobject) {
                var degree = i * 320 / ialts + 20; //+40 degrees are left for the text of the level
                var newx = Math.cos(toRadians(degree)) * distance + xtarget;
                var newy = Math.sin(toRadians(degree)) * distance + ytarget;
                alternativeobject.x = newx;
                alternativeobject.y = newy;
                alternativeobject.r = rtarget / 6;
                //draw circle:
                var altcircle = vis.append("svg:circle")
                        .attr("r", rtarget / 6)
                        .attr("class", function () {
                            classtext = "alternative";
                            var codearray = jQuery.makeArray(alternativeobject.tags);

                            if ($.inArray(tags.NotIncluded, codearray) >= 0)
                            {
                                classtext = classtext + " circlesNichtEmpfohlen";
                            }
                            else if ($.inArray(tags.Extended, codearray) >= 0)
                            {
                                classtext = classtext + " circlesErweiterungsteil";
                            }

                            else if ($.inArray(tags.Schale, codearray) >= 0)
                            {
                                classtext = classtext + " circlesSchale";
                            }

                            /*     else if ($.inArray(tags.teilweiserForschungsbezug, codearray) >= 0)
                             {
                             return cTeilweiserForschungsbezugSchale2;
                             }
                             else if ($.inArray(tags.PublikationenSchale2, codearray) >= 0)
                             {
                             return cTeilweiserForschungsbezugSchale2;
                             }*/
                            else if ($.inArray(tags.Included, codearray) >= 0)
                            {
                                classtext = classtext + " circlesEmpfohlen";
                            }
                            else
                            {
                                classtext = classtext + " circlesNotClassed";
                            }
                            return classtext;
                        })
                        .attr("transform", function () {
                            return "translate(" + newx + "," + newy + ")";
                        })
                        //   .style("fill", function(d) { return d.children ? color(d.depth) : null; })
                        .on("mouseover", function () {
                            if (!circleSelected) {
                                updatedetails(alternativeobject);
                            }
                        })
                        .on("mousedown", function () {
                            $(this).css('cursor', 'move');
                            // showDragPointer(this);
                        })
                        .on("mouseup", function () {
                            $(this).css('cursor', 'pointer');
                            //  hideDragPointer(this);
                        })
                        .on("click", function () {
                            if (CheckSelectionClick()) {
                                return;
                            }  //exit function if it was a panning click, instead of a selection click
                            d3.event.stopPropagation();
                            // console.log(d);
                            if (circleSelected)
                            {
                                if (focus !== alternativeobject) //another circle was selected!
                                {
                                    //reset all other nodes:
                                    d3.selectAll("circle").filter(function (d) {
                                        return this.style.strokeWidth === "9px"; // only with circles in the main graph!
                                    }).style("stroke-Width", "0.2px").style("stroke", "#000");
                                    //set width of the selected circle:
                                    this.style.stroke = "#FFF";
                                    this.style.strokeWidth = "9px";
                                    focus = alternativeobject;


                                }
                                else
                                {

                                    circleSelected = false;
                                    this.style.stroke = "#000";
                                    this.style.strokeWidth = "0.2px";
                                }
                            }
                            else
                            {
                                circleSelected = true;
                                //reset all other nodes:
                                d3.selectAll("circle").filter(function (d) {
                                    return this.style.strokeWidth === "9px"; // only with circles in the main graph!
                                }).style("stroke-Width", "0.2px").style("stroke", "#000");
                                this.style.stroke = "#FFF";
                                this.style.strokeWidth = "9px";
                            }
                            updatedetails(alternativeobject);
                            /*if (focus !== alternativeobject)
                             {
                             zoom2(d);
                             
                             }*/
                        })
                        ;

                showarguments(alternativeobject, i_t, true);


                vis.append("text")
                        .attr("class", "alternative-text circleText")
                        .text(function () {
                            var displaytext = cutAfter(alternativeobject.name, " ");


                            if (displaytext.length > 30) {
                                return displaytext.substring(0, 30) + "...";
                            } else {
                                return displaytext;
                            }
                        })
                        .attr("transform", function () {
                            return "translate(" + newx + "," + newy + ")";
                        })

                        ;

                i += 1;
            });


        }
    }

    function showarguments(d, i_t, stop) {
        //stop determines, if the element is an alternative (then do not show sub-alternatives)
        if (parseInt(visargumentsvis) !== 0)
        {

            var focus = d;
            var v = i_t; //get the target view  
            var k = diameter / v[2];
            if (typeof stop !== 'undefined') {
                var xtarget = d.x;
                var ytarget = d.y;
                var rtarget = d.r + 2 + 6;
            } else
            {
                var xtarget = (d.x - v[0]) * k;
                var ytarget = (d.y - v[1]) * k;
                var rtarget = (d.r * k + 2) + 6;
            }


            //get the number of circle segments (arguments:)
            var iargs = d.NodeArguments.length;
            var i = 0;
            var argumentsSorted = d.NodeArguments.sort(dynamicSort("NodeType"));
            //360 ° / number:
            argumentsSorted.forEach(function (argumentobject) {
                var startdegree = i * 360 / iargs + 45 + 3; //+2 degrees for Separating
                var enddegree = startdegree + 360 / iargs - 3; //-2 degrees for Separating  
                var middegree = (enddegree - startdegree) / 2 + startdegree;
                var textx = xtarget + (rtarget + 10) * Math.cos((90 - middegree) * (Math.PI / 180)) - 2; //- 5 for the text's space
                var texty = ytarget - (rtarget + 10) * Math.sin((90 - middegree) * (Math.PI / 180)) + 5;//+ 5 for the text's space
                arc = d3.svg.arc()
                        .innerRadius(rtarget)
                        .outerRadius(rtarget + 20)
                        .startAngle(startdegree * (Math.PI / 180)) //convert from degs to radians
                        .endAngle(enddegree * (Math.PI / 180)); //just radians
                //compute next angles:

                var targetelement;
                if (typeof stop !== 'undefined') {
                    vis.append("path")
                            .attr("d", arc)
                            .attr("class", function () {
                                return argumentobject.Nodetype === "6" ? "argumentpro" : "argumentcon";
                            })
                            .attr("transform", function () {
                                return "translate(" + xtarget + "," + ytarget + ")";
                            })
                            .on("mouseover", function () {
                                if (!circleSelected)
                                    updatedetails(argumentobject, d);
                            })
                            .on("click", function () {
                                if (CheckSelectionClick()) {
                                    return;
                                }  //exit function if it was a panning click, instead of a selection click
                                focus = null;
                                circleSelected = false;
                                d3.selectAll("circle").filter(function (d) {
                                    return this.style.strokeWidth === "9px"; // only with circles in the main graph!
                                }).style("stroke-Width", "0.2px").style("stroke", "#000");
                                updatedetails(argumentobject, d);
                                //set width of the selected circle:

                            })

                    vis.append("text")
                            .attr("class", "packArgumentText")
                            .text(function (d) {
                                return argumentobject.Nodetype === "6" ? "+" : "-";
                            })
                            .attr("transform", function () {
                                return "translate(" + textx + "," + texty + ")";
                            });

                }
                else {
                    targetelement = d3.selectAll("g.node").filter(function (d) {
                        return d === focus;
                    })
                            .append("path")
                            .attr("d", arc)
                            .attr("class", function (d) {
                                return argumentobject.Nodetype === "6" ? "argumentpro" : "argumentcon";
                            })
                            .attr("transform", function (d) {
                                return "translate(" + xtarget + "," + ytarget + ")";
                            })
                            .on("mouseover", function (d) {
                                if (!circleSelected)
                                    updatedetails(argumentobject, d);
                            })
                            .on("click", function () {
                                if (CheckSelectionClick()) {
                                    return;
                                }  //exit function if it was a panning click, instead of a selection click
                                focus = null;
                                circleSelected = false;
                                d3.selectAll("circle").filter(function (d) {
                                    return this.style.strokeWidth === "9px"; // only with circles in the main graph!
                                }).style("stroke-Width", "0.2px").style("stroke", "#000");
                                updatedetails(argumentobject, d);
                                //set width of the selected circle:     
                            })
                            ;
                    d3.selectAll("g.node").filter(function (d) {
                        return d === focus;
                    }).append("text")
                            .attr("class", "packArgumentText")
                            .text(function (d) {
                                return argumentobject.Nodetype === "6" ? "+" : "-";
                            })
                            .attr("transform", function () {
                                return "translate(" + textx + "," + texty + ")";
                            });
                }


                // Tooltip stuff after this
                /*    .on("mouseover", function(v) {
                 tooltip.transition()
                 .duration(200) //longer to easier be seen
                 .style("opacity", 0.9);
                 var text = argumentobject.name;
                 tooltip.html(text)
                 .style("left", (d3.event.pageX)+"px")
                 .style("top", (d3.event.pageY-28) + "px")
                 .attr("class", "tooltip");
                 // .style("opacity", 0.9); // not here
                 })
                 .on("mouseout", function() {
                 tooltip.transition()
                 .duration(400)  //longer to easier be seen
                 .style("opacity", 0);
                 });*/



                //Write argument text:
                /*   var argtext = svg.append("text")
                 .attr("x", 6)
                 .attr("dy", 15);
                 
                 text.append("textPath")
                 .attr("stroke","black")
                 .attr("xlink:href","#path1")
                 .text("abc");*/


                i = i + 1; //set i for next iteration
            });

        }
    }


    function addPlaceholders(node) {
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {

                var child = node.children[i];
                addPlaceholders(child);
            }

            if (node.children.length === 1) {

                node.children.push({name: 'placeholder', children: [{name: 'placeholder', value: 20, children: []}]});
            }
        }
    }
    ;
    function removePlaceholders(nodes) {

        for (var i = nodes.length - 1; i >= 0; i--) {

            var nodeintern = nodes[i];

            if (nodeintern.name === 'placeholder') {

                nodes.splice(i, 1);
            } else {

                if (nodeintern.children) {

                    removePlaceholders(nodeintern.children);
                }
            }
        }
    }
    ;

    function centerNodes(nodes) {

        for (var i = 0; i < nodes.length; i++) {

            var nodeintern = nodes[i];

            if (nodeintern.children) {

                if (nodeintern.children.length === 1) {

                    var offset = nodeintern.x - nodeintern.children[0].x;
                    nodeintern.children[0].x += offset;
                    reposition(nodeintern.children[0], offset);
                }
            }
        }

        function reposition(nodeintern, offset) {

            if (nodeintern.children) {
                for (var i = 0; i < nodeintern.children.length; i++) {

                    nodeintern.children[i].x += offset;
                    reposition(nodeintern.children[i], offset);
                }
            }
        }
        ;
    }
    ;

    function makePositionsRelativeToZero(nodes) {
        //use this to have vis centered at 0,0,0 (easier for positioning)
        var offsetX = nodes[0].x;
        var offsetY = nodes[0].y;

        for (var i = 0; i < nodes.length; i++) {

            var nodeintern = nodes[i];

            nodeintern.x -= offsetX;
            nodeintern.y -= offsetY;
        }
    }
    ;
    function drawCircle() {
        circle = node.append("svg:circle")
                .attr("r", function (d) {
                    return d.r;
                })

                .attr("class", function (d) {

                    var classtext = "";
                    classtext = d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
                    var codearray = jQuery.makeArray(d.tags);

                    if ($.inArray(tags.NotIncluded, codearray) >= 0)
                    {
                        classtext = classtext + " circlesNichtEmpfohlen";
                    }
                    else if ($.inArray(tags.Extended, codearray) >= 0)
                    {
                        classtext = classtext + " circlesErweiterungsteil";
                    }
                    else if ($.inArray(tags.Schale, codearray) >= 0)
                    {
                        classtext = classtext + " circlesSchale";
                    }

                    /*     else if ($.inArray(tags.teilweiserForschungsbezug, codearray) >= 0)
                     {
                     return cTeilweiserForschungsbezugSchale2;
                     }
                     else if ($.inArray(tags.PublikationenSchale2, codearray) >= 0)
                     {
                     return cTeilweiserForschungsbezugSchale2;
                     }*/
                    else if ($.inArray(tags.Included, codearray) >= 0)
                    {
                        if (classtext.indexOf("node--root") == -1) {
                            classtext = classtext + " circlesEmpfohlen";
                        }
                    }
                    else
                    {
                        classtext = classtext + " circlesNotClassed";
                    }
                    return classtext;
                });


        circle
                .attr("id", function (d) {
                    return d.id;
                })
                .style("display", function (d) {
                    //only show, if the element 

                    return (d.level <= (vislevel) && filtered(d) == 0) ? null : "none";

                })
                //   .style("fill", function(d) { return d.children ? color(d.depth) : null; })
                .on("mouseover", function (d) {
                    if (!circleSelected) {
                        updatedetails(d);
                    }
                })
                .on("mousedown", function () {
                    $(this).css('cursor', 'move');
                    // showDragPointer(this);
                })
                .on("mouseup", function () {
                    $(this).css('cursor', 'pointer');
                    //  hideDragPointer(this);
                })
                
                .on("click", function (d) {
                    if (CheckSelectionClick()) {
                        return;
                    }  //exit function if it was a panning click, instead of a selection click
                    d3.event.stopPropagation();
                    // console.log(d);
                    if (circleSelected)
                    {
                        if (focus !== d) //another circle was selected!
                        {
                            //reset all other nodes:
                            d3.selectAll("circle").filter(function (d) {
                                return this.style.strokeWidth === "9px"; // only with circles in the main graph!
                            }).style("stroke-Width", "0.2px").style("stroke", "#000");
                            //set width of the selected circle:
                            this.style.stroke = "#FFF";
                            this.style.strokeWidth = "9px";

                        }
                        else
                        {
                            circleSelected = false;
                            this.style.stroke = "#000";
                            this.style.strokeWidth = "0.2px";
                        }
                    }
                    else
                    {
                        circleSelected = true;
                        //reset all other nodes:
                        d3.selectAll("circle").filter(function (d) {
                            return this.style.strokeWidth === "9px"; // only with circles in the main graph!
                        }).style("stroke-Width", "0.2px").style("stroke", "#000");
                        this.style.stroke = "#FFF";
                        this.style.strokeWidth = "9px";
                    }
                    updatedetails(d);
                    if (focus !== d)
                    {
                        zoom2(d);

                    }
                })

                ;
        return circle;
    }

    function zoom2(d) {




        focus = d;
        lastfocusID = focus.id;
        sessionStorage.setItem('recentID', lastfocusID);
        var i_t;
        var transition = d3.transition()
                .duration(700)
                .tween("zoom", function (d) {
                    var alternativeFactor = 2.5;
                    if (focus.NodeAlternatives != null)
                    {
                        alternativeFactor = focus.NodeAlternatives.length > 0 ? 3.5 : 2.5;
                    }


                    var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * alternativeFactor + margin]);
                    return function (t) {
                        i_t = i(t);
                        zoomTo(i_t);
                    };
                });
//change visible texts when zooming:
        transition.selectAll(".circleText")//.selectAll(".circleText")
                .filter(function (d) {
                    return d.parent === focus || d === focus || this.style.display === "inline";
                })
                .style("fill-opacity", function (d) {
                    return d.parent === focus || d === focus ? 1 : 0;
                })
                .each("start", function (d) {
                    // if parent has focus --> show label:
                    if (d.parent === focus) {
                        this.style.display = "inline";
                        if (!d.children) {
                            this.style.fontSize = 11;
                            var displaytext = cutAfter(d.name, " ").substr(0, d.r * 5);
                            if (displaytext.length > 15) {
                                displaytext = displaytext.substr(0, 15);
                            }
                            this.innerHTML = displaytext;
                        }
                    }
                    // if itself has focus and is leaf:
                    if (d === focus && !d.children && filtered(d) == 0 && parentfiltered(d) == 0) {
                        this.style.display = "inline";
                        this.style.fontSize = 15;
                        var displaytext = cutAfter(d.name, " ");
                        if (displaytext.length > 15) {
                            displaytext = displaytext.substr(0, 15);
                        }
                        this.innerHTML = displaytext;
                    }
                    //if itself has focus and is not leaf:
                    if ((d === focus && d.children) || filtered(d) == 1 || parentfiltered(d) == 1)
                        this.style.display = "none";
                });




        transition.selectAll(".circleText")//.selectAll(".circleText")
                .each("end", function (d) {

                    if (d.parent !== focus && d !== focus)
                        this.style.display = "none";
                });
        //change visible circles when zooming:
        //resetVisibleCircles(focus);

        updateVisibility(focus); //After this, all elements have the attribute Xopacity with the target opacity

        transition.selectAll("circle")

                .each("start", function (d) {
                    if (d === focus) {
                        vis.selectAll(".argumentpro").remove();
                        vis.selectAll(".argumentcon").remove();
                        vis.selectAll(".packArgumentText").remove();
                    } //remove all shown arguments!
                    if (d === focus) {
                        vis.selectAll(".alternative").remove();
                    } //remove all shown alternatives!
                    if (d === focus) {
                        vis.selectAll(".alternative-text").remove();
                    } //remove all shown alternatives! 


                    if ((d.Xopacity === 1 || d.Xopacity === transparencyNotFocused) && this.style.display !== "inline") {
                        this.style.display = "inline";
                    }
                }
                ) //aktiviere die, die bisher nicht sichtbar sind
                .style("opacity", function (d) {
                    return d.Xopacity;
                })
                .each("end", function (d) {
                    if (d === focus) {

                        showalternatives(d, i_t);
                        showarguments(d, i_t);
                    } //display arguments (i_t is needed from here, in order to know the viewport size
                    if (d.Xopacity === 0) {
                        this.style.display = "none";
                    }
                });

        jumpToElementIfSpecified();


    }



    function updateVisibility(focus) {
        //centrally sets the visibility information, by iterating through the whole tree (once)
        //1. First get the area root (= level1) of the selected node:
        //1. get area root node (level1):

        var arearoot = focus;
        //Special Case: Selected Root:
        if (focus.level == 0) {
            visRecusion(focus, focusArea.DirectFocus, focus);
        }
        else
        {//not root selected:

            while (arearoot.level > 1) {
                arearoot = arearoot.parent;
            }
            //2.get the overall root:
            var root = arearoot.parent;
            //3. 
            if (root != null) {
                root.children.forEach(function (child) {
                    if (child === arearoot)
                    {//For the area with the selected node, differentiate:               
                        visRecusion(child, focusArea.NearFocus, focus)
                    }
                    else
                    {//For all areas that are not branches, set visibility to 0:
                        visRecusion(child, focusArea.NoFocus, focus)
                    }
                }

                );
            }
        }
    }


    function visRecusion(node, foArea, focus)
    {
        if (foArea === focusArea.DirectFocus)
        {
            if (node.level <= parseInt(focus.level) + parseInt(vislevel))
            {
                if (filtered(node) == 0) {
                    node.Xopacity = 1;
                    setFocusForAllChildren(node, focusArea.DirectFocus, focus); //recurse through children (all of them not visible!)

                } else {
                    node.Xopacity = 0;
                    setFocusForAllChildren(node, focusArea.NoFocus, focus); //recurse through children (all of them not visible!)  
                }

            }
            else
            { //Is to be displayed, but the focus level is not deep enough to allow for  showing:
                node.Xopacity = 0;
                setFocusForAllChildren(node, focusArea.NoFocus, focus); //recurse through children (all of them not visible!)                              
            }

        }
        else if (foArea === focusArea.NearFocus)
        {
            if (node === focus) //if this node is the focus node, set opacity to 1
            {
                if (filtered(node) == 0) {
                    node.Xopacity = 1;
                    setFocusForAllChildren(node, focusArea.DirectFocus, focus); //recurse through children (all of them not visible!)

                } else {
                    node.Xopacity = 0;
                    setFocusForAllChildren(node, focusArea.NoFocus, focus); //recurse through children (all of them not visible!)  
                }
                //Children (up to x levels) are also to be set to 1:

            }
            else
            {



                if (filtered(node) == 0) {
                    node.Xopacity = transparencyNotFocused;
                    setFocusForAllChildren(node, focusArea.NearFocus, focus); //recurse through children (all of them not visible!)

                } else {
                    node.Xopacity = 0;
                    setFocusForAllChildren(node, focusArea.NoFocus, focus); //recurse through children (all of them not visible!)  
                }
                //Children (up to x levels) are also to be set to 1:

            }
        }
        else
        {//This area is without focus:
            if (node.level <= vislevel) {

                if (filtered(node) == 0 && parentfiltered(node) == 0) {
                    node.Xopacity = transparencyNotFocused;

                } else {
                    node.Xopacity = 0;
                    setFocusForAllChildren(node, focusArea.NoFocus, focus); //recurse through children (all of them not visible!)  

                }

            } else {
                node.Xopacity = 0;
                //only the thirst X levels are generally shown
            }
            setFocusForAllChildren(node, focusArea.NoFocus, focus); //recurse through children (all of them not visible!)  

        }

    }



    function setFocusForAllChildren(node, focusAreaSet, focus) {
        if (node.children) {
            node.children.forEach(function (child) {
                visRecusion(child, focusAreaSet, focus); //recurse through children (all of them not visible!)
            });
        }
    }


    function zoomTo(v) {
        var k = diameter / v[2];
        view = v;
        node.attr("transform", function (d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        text.attr("transform", function (d) {
            return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        circle.attr("r", function (d) {
            return d.r * k + 2;
        });
        /*arc.attr("innerRadius", function(d) { 
         return d.innerRadius * k+2; 
         });
         arc.attr("outerRadius", function(d) { 
         return d.innerRadius * k+2;
         });
         arc.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });*/
    }





    var margin = 20,
            diameter = 1000,
            format = d3.format(",d");
//var color = d3.scale.linear()
//    .domain([-1, 5])
//    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
//    .interpolate(d3.interpolateHcl);

    var pack = d3.layout.pack()
            .padding(2)
            .size([diameter - margin, diameter - margin])
            // .value(function(d) { return d.size; });
            /* .sort( function(a, b) {
             var threshold = 10000000;
             if ((a.value > threshold) && (b.value > threshold)) {
             return -(a.value - b.value);
             } else {
             return -1;
             }
             })
             ;*/
            .sort(function (a, b) {
                return b.value - a.value;
            })
            .value(function (d) {
                return Math.max(3000, d.value);
            })

            ;





    var vis = d3.select("#chart").append("svg:svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "pack")
            // .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
            .append("svg:g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var rootnodeset = false;




    var spinbox = document.getElementById('chart');
    var spinner = new Spinner(opts).spin(spinbox); //shows the waiting animation





    d3.json("data/kdsf-neu.json", function (error, root) {
        if (error)
            return console.error(error);

        if (rootnodeset === false) {
            appendParentToAllNodes(root);
            appendSearchIDToAllNodes(root, "");
            rootnodeset = true;
        }



        addPlaceholders(root);
        var packed = (pack.nodes(root));
        //Remove Placeholders again:    
        removePlaceholders(packed);
        centerNodes(packed);
        makePositionsRelativeToZero(packed);
        node = vis.data([root]).selectAll("g.node")
                .data(packed)
                .enter().append("svg:g")
                .attr("class", function (d) {
                    return d.children ? "node" : "leaf node";
                })
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });



        drawCircle();


        node.append("svg:title")

                .text(function (d) {
                    var typetext;
                    if (d.Nodetype == 10) {
                        typetext = " [" + texts.Status.Aggregationsniveau + "]";
                    }
                    else if (d.Nodetype == 9) {
                        typetext = " [" + texts.Status.Auspraegung + "]";
                    }
                    else if (d.Nodetype == 4) {
                        typetext = " [" + texts.Status.Ausdiff + "]";
                    }
                    else
                    {
                        typetext = "";
                    }

                    if (d.level == 1) {
                        typetext = " [" + texts.Status.Bereich + "]";
                    }
                    if (d.level == 3) {
                        typetext = " [" + texts.Status.Kerndatum + "]";
                    }


                    return d.name + typetext;
                });




        //vislevel

        /*  var text=node.append("svg:text")
         .attr("class", "label")
         .style("fill-opacity", function(d) { return (d.parent === root ) ? 1 : 0; })
         .style("display", function(d) { return (d.parent === root ) ? null : "none"; })
         .text(function(d) { return d.name;
         //if (d.class==="node--leaf") {return d.name;  } else {return d.name.substring(0, d.r*2);}
         });
         //.text(function(d) { return d.name; });
         
         //
         //*/

        text = vis.selectAll("text")
                .data(packed)
                .enter().append("text")
                .attr("class", "label circleText")
                .style("fill-opacity", function (d) {
                    return (d.parent === root) ? 1 : 0;
                })
                .style("display", function (d) {
                    return (d.parent === root && filtered(d) == 0) ? null : "none";
                })
                .text(function (d) {
                    var displaytext = cutAfter(d.name, " ");
                        if (d.parent==root)
                        {
                            return displaytext;
                           
                        }
                        else
                        {
                               if (displaytext.length > 20) {
                                return displaytext.substring(0, 20) + "...";
                            } else {
                                return displaytext;
                            }
                        }
                     
       
                    
                    //if (d.class==="node--leaf") {return d.name;  } else {return d.name.substring(0, d.r*2);}
                })
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });




        jumpToElementIfSpecified();

        if (focus === null)
        {
            focus = root;
        }


        d3.selectAll("svg").selectAll(".pack")
                // .style("background", color(-1))
                .on("click", function () {
                    if (CheckSelectionClick()) {
                        return;
                    }  //exit function if it was a panning click, instead of a selection click
                    if (circleSelected === false) {
                        zoom2(root);
                    }
                });


        zoomTo([root.x + 120, root.y + 285, root.r * 3 + margin]);

        d3.select(self.frameElement).style("height", diameter + "px");

        spinner.stop(); //removes the waiting animation
        if (tutorialmode != null)
        {
            // showPackedCircleTutorial();
        }
    });

    function showPackedCircleTutorial() {
        //Introduction to the packed circle visualization.
        //#####Step 1.: Abbildungsfläche:
        //$('.helpoverlayright').show();
        // $('.helptextright').load("helptexts/packedcircle/1.Abbildungsflaeche.html");


        $('.helpoverlayright').show();
        // $('.helptextright').load("helptexts/packedcircle/1.Abbildungsflaeche.html");

    }



}


