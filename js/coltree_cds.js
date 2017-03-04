/* 
 * 
 */
var root;

 
var focusCol;
$(document).ready(function() {
    $('#chart').mousedown(function() {
      
           
 $(this).css('cursor', 'move');
    });
    $('#chart').mouseup(function() {
    
            
 $(this).css('cursor', 'auto');
    });
});
function showalternativesColTree(d)
{
    if (parseInt(visalternativesvis) === 1)
    {
        var newy = d.y;
        if (d.hasOwnProperty("NodeAlternatives"))
        {
            d.NodeAlternatives.forEach(function(alternativeobject) {
                var newx = d.nodewidthtotal; //is set initially above, and updated after each written text
                alternativeobject.x = newx;
                alternativeobject.y = newy;
                //draw rect:
                var altrect = vis.append("svg:rect")
                        .attr("transform", function() {
                    return "translate(" + newx + "," + newy + ")";
                })
                        .style("opacity", function() {
                    if (alternativeobject===focusCol) {return  1;}  else   {return  ctProperties.opacityAlternative;}
                   
                })
                        .attr("width", ctProperties.rectwidth)
                        .attr("height", ctProperties.rowheight - 5)


                        .attr("class", function(d) {
                    return return_fill_class(alternativeobject) + " colrect_alternative col_all_rects";
                })
                        //.on("click", function(d){clickCol(alternativeobject);})
                        .on("mouseover", function(d) {

                    if (focusCol === null) {
                        updatedetails(alternativeobject);
                    }
                    ;
                });
                altrect = appendTitleRect(altrect, alternativeobject);



                alttext = vis.append("text")
                        .style("opacity", function() {
                    if (alternativeobject===focusCol) {return  1;}  else   {return  ctProperties.opacityAlternative;}
                })
                        .attr("class", "coltext alternative-text_coltree col_all_texts")
                        .attr("x", function(d) {
                    return hor_text_margin;
                })
                        .attr("y", function(d) {
                    return dy_text;
                })
                        .classed("justadded",true)
                        .style("cursor", "hand")
                        .text(function() {
                    if (alternativeobject.name.length > 50) {
                        return alternativeobject.name.substring(0, 50) + "...";
                    } else {
                        return alternativeobject.name;
                    }
                })
                        .attr("transform", function() {
                    return "translate(" + (newx + ctProperties.rectwidth + 2) + "," + newy + ")";
                })
                 .attr("id", function(){return alternativeobject.id;})
                        .on("click", function(d) {
                    return clickCol(alternativeobject);
                })
                        .on("mouseover", function(d) {

                    if (focusCol === null) {
                        updatedetails(alternativeobject);
                    }
                });
                altrect = appendTitleText(alttext, alternativeobject);
                var nodesel = d3.select(".justadded")
                        .classed('justadded', false); //remove the id, so that there is only one element with the id
                alternativeobject.textwidth = nodesel.node().getComputedTextLength() + ctProperties.rectwidth + hor_text_margin + hor_text_margin_after + alternativeobject.x;

                // nodesel.getComputedTextLength() + ctProperties.rectwidth + 2*hor_text_margin+hor_text_margin_after+d.x;
                d.nodewidthtotal = d.nodewidthtotal + nodesel.node().getComputedTextLength() + ctProperties.rectwidth + hor_text_margin + hor_text_margin_after; //update for next positioning

                showargumentsColTree(alternativeobject, true);

            }
            );
        }

    }
}



function showargumentsColTree(d, alternativeArguments) { //argumentsX is only passed, if the element is not the 
    if (alternativeArguments === undefined) {
        alternativeArguments = false;
    }
    
    
    
    if (parseInt(visargumentsvis) !== 0)
    {
       
 
        
        var xstart = d.x + ctProperties.rectwidth + hor_text_margin; //starting x for all alternatives in node
        var xend = d.textwidth;
        var y = ctProperties.rowheight + d.y -5;


        //get the number of segments (arguments:)
        var iargs = d.NodeArguments.length;
        var i = 0;
        var xwidthtotal = (xend - xstart) / iargs; //the space available for each argument
        var argumentsSorted = d.NodeArguments.sort(dynamicSort("NodeType"));
        argumentsSorted.forEach(function(argumentobject) {

            var xstart_temp = xstart + i * xwidthtotal + 2; //the starting point for the single argument
            var xwidth_temp = xwidthtotal - 4; //the width of the argument block

            vis.append("svg:rect")
                    .attr("x", xstart_temp)
                    .attr("y", y)
                    .attr("width", xwidth_temp)
                    .attr("height", rect_height_argument)
                    .style("stroke-opacity", function() { if (alternativeArguments && focusCol!==d) {return ctProperties.opacityAlternative;} else {return 1;}
          
            })
                    .attr("class", function() {var alttext=""; if (alternativeArguments) {alttext=" alternative";}
                return argumentobject.Nodetype === "6" ? "col_all_rects colrect_argumentpro" + alttext : "col_all_rects colrect_argumentcon" + alttext;
            })

                    .on("mouseover", function() {
                if (focusCol === null) {
                    updatedetails(argumentobject, d);
                }
            });
            vis.append("svg:text") //show + or - sign
                    .attr("x", xstart_temp + xwidth_temp / 2 - 3)
                    .attr("y", function() {
                return argumentobject.Nodetype === "6" ? y + rect_height_argument / 2 + 4 : y + rect_height_argument / 2 + 3;
            })
                    .style("opacity", function() {if (alternativeArguments) {return ctProperties.opacityAlternative;} else {return 1;}
            })
       .on("mouseover", function() {
                if (focusCol === null) {
                    updatedetails(argumentobject, d);
                }})
                    .attr("class", function(d) {var alttext=""; if (alternativeArguments) {alttext=" alternative";} 
                return "col_all_texts coltext_argument" + alttext;})
                    .text(function(d) {
                return argumentobject.Nodetype === "6" ? "+" : "-";
            })
            

            i = i + 1; //set i for next iteration
        });

    }
}



function appendTitleText(target, extnode) {
    target.append("svg:title").text(function(d) {
        var intnode;
        if (extnode == -1) {
            intnode = d;
            target;
        } else {
            intnode = extnode;
        }

        var typetext;
        if (intnode.Nodetype == 10) {
            typetext = " [" + texts.Status.Aggregationsniveau + "]";
        }
        else if (intnode.Nodetype == 9) {
            typetext = " [" + texts.Status.Auspraegung + "]";
        }
        else if (intnode.Nodetype == 4) {
            typetext = " [" + texts.Status.Ausdiff + "]";
        }
        else
        {
            typetext = "";
        }
        if (intnode.level == 1) {
            typetext = " [" + texts.Status.Bereich + "]";
        }
        if (intnode.level == 3) {
            typetext = " [" + texts.Status.Kerndatum + "]";
        }

        return intnode.name + typetext;
    });
    return target;
}


function appendTitleRect(target, extnode) {
    target.append("svg:title").text(function(d) {
        var intnode;
        if (extnode == -1) {
            intnode = d;
            target;
        } else {
            intnode = extnode;
        }
        var typetext;
        var codearray = jQuery.makeArray(intnode.tags);
        if ($.inArray(tags.Extended, codearray) >= 0) {
            typetext = "Orange: " + texts.Tags.Extended;
        }
        else if ($.inArray(tags.Included, codearray) >= 0) {
            typetext = "Grün: " + texts.Tags.Included;
        }
        else if ($.inArray(tags.NotIncluded, codearray) >= 0) {
            typetext = "Rot: " + texts.Tags.NotIncluded;
        }
        else if ($.inArray(tags.Schale, codearray) >= 0) {
            typetext = "Violett: " + texts.Tags.Schale;
        }
        else
        {
            typetext = "";
        }

        return  typetext;
    });
    return target;
}
function appendTitleArgument(target, node) {

}

if (vismode == 2  && selectedslide==1)
{

    var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 4000 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom;
    var i = 0,
            duration = 350;
    var diagonal = d3.svg.diagonal()
            .projection(function(d) {
        return [d.y, d.x];
    });
    

    var hor_text_margin = 4;
    var hor_text_margin_after = 20;
    var linkwidth = 1;
    var dy_text = 15;
    




    /*var diagonal = d3.svg.diagonal()
     .projection(function(d) { return [d.y, d.x]; });*/
    var ctProperties={}; //properties for the collapsible tree
    ctProperties['opacityAlternative']=0.5;
    ctProperties['opacity']=1;
    ctProperties['rowheight']=25; //initial rowheight
    ctProperties['rectwidth']=10; //width of the status bar before the title
    ctProperties['rect_height_argument']=8; //initial argument height

var rowheight=ctProperties.rowheight + ctProperties.rect_height_argument; //total row height used for arguments+text
var rect_height_argument=ctProperties.rect_height_argument;

    var vis = d3.select("#chart").append("svg:svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)

           
            .append("g")
            //    .call(d3.behavior.zoom().scaleExtent([0, 20]).on("zoom", zoom)) // no need for registration, is done by the zoomlistener in generalJS.js!
          
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 var spinbox = document.getElementById('chart');
    var spinner = new Spinner(opts).spin(spinbox); //shows the waiting animation


    d3.json("data/kdsf-neu.json", function(error, data) {

        root = data;
        root.x0 = 0;
        root.y0 = 0;
        

        root.children.forEach(collapse);
        update(root);
        spinner.stop(); //removes the waiting animation
    });
    

}
function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }



function update(source) {
  
    // Compute the new tree layout.


    var nodes = myTreeLayout(root);
    // recusively compute positions:

//  positions(nodes[0],0);

    // Update the nodes…
    var node = vis.selectAll("g.node_coltree")
            //    .data(nodes , function(d) { return d.Nodeid; });
            .data(nodes, function(d) {
        return d.id || (d.id = ++i)
    });
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g").classed("node_coltree", true)
            .attr("id", function(d) {
        return "N" + d.Nodeid;
    })
            .attr("transform", function(d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
    })
            .style("fill-opacity", 1e-6);
    //##### Add Element Rect and Text:
    var recentrect = nodeEnter.append("svg:rect")
            .attr("x", function(d) {
        return 0;
    })
            .attr("y", function(d) {
        return 0;
    })
            .attr("width", ctProperties.rectwidth)
            .attr("height", ctProperties.rowheight - 4)
            .attr("class", function(d) {
        return return_fill_class(d) + " col_all_rects colrect";
    })
            .on("click", function(d) {
        clickCol(d);
    }
    )
            .on("mouseover", function(d) {
        if (focusCol === null) {
            updatedetails(d);
        }
    });
    recentrect = appendTitleRect(recentrect, -1);
    nodeEnter.append('svg').html(function(d) {
        
        if (d.Nodetype == 10) {
            return icon_aggregation;
        }
        else if (d.Nodetype == 9) {
            return icon_ausdifferenzierung;
        }
        else if (d.Nodetype == 4) {
            if (d.level == 1) {
                return icon_bereich;
            }
            else if (d.level == 3) {
                return icon_kerndatum;
            }
            else
            {
                return icon_ausdifferenzierung;
            }
            
        }
        else
        {
         //return icon_kerndatum;  
        }


        })
    .attr("x",ctProperties.rectwidth+2)
    .attr("y",2);
    
    nodeEnter.append("text") //append + and - to rectangles:
    .attr("x",ctProperties.rectwidth/2-2)
    .attr("y",rowheight/2-2)
    .classed("ctExpandlabel",true) //col_all_texts",true)
     .on("click", function(d) { clickCol(d); });

    
    var recenttext = nodeEnter.append("text")
            .attr("x", function(d) {
        return hor_text_margin + ctProperties.rectwidth +16;
    })
            .attr("y", function(d) {
        return dy_text;
    })
            .attr("class", "coltext col_all_texts")
            .text(function(d) {

        return d.name;
    })
             .attr("id", function(d){return d.id;})
             .on("click", function(d) {
        clickCol(d, true);
    })
            .on("mouseover", function(d) {
        if (focusCol === null) {
            updatedetails(d);
        }
    });
    recenttext = appendTitleText(recenttext, -1);

    d3.selectAll(".col_all_texts")//.filter(function(d){  return this.classList.contains("ctExpandlabel")==false;}) //##hierweiter
            .each(function(d, i) {
        nodesel = d3.select(this).node()
        if (typeof d !== 'undefined') {
            d.textwidth = nodesel.getComputedTextLength() + ctProperties.rectwidth + 2 * hor_text_margin + hor_text_margin_after + d.x;

            //  d.nodewidthtotal + nodesel.node().getComputedTextLength() + ctProperties.rectwidth + hor_text_margin;

            d.nodewidthtotal = d.textwidth;
        }
    });

    nodeEnter.append("path")
            .attr("initialPathColor", this.stroke)
            .attr("class", "link_coltree")
            .attr("d", function(d) {
        if (d.parent !== null) {
            var o = {x: 0 + ctProperties.rectwidth - linkwidth / 2, y: 0 + ctProperties.rowheight - linkwidth / 2};
            return bezier(o, o, o); //function bezier(source_point,control_point,target_point,relative)
        }
        ;
    });
    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
            .duration(duration)
            .style("fill-opacity", 1)
            .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    })
            .each("start", function(d) {

        vis.selectAll(".coltext_argument").remove();
        vis.selectAll(".colrect_argumentpro").remove();
        vis.selectAll(".colrect_argumentcon").remove(); //remove all shown arguments!
        vis.selectAll(".coltext_alternative").remove(); //remove all shown alternatives!
        vis.selectAll(".colrect_alternative").remove(); //remove all shown alternatives!
        vis.selectAll(".alternative-text_coltree").remove(); //remove all shown alternatives! 

    })
            .each("end", function(d) {
        showalternativesColTree(d);
        showargumentsColTree(d);
    })
            ;

    nodeUpdate.selectAll(".link_coltree")
            .attr("d", function(d) {
        if (d.parent !== null) {
            var psource = {x: -1 * (d.x - d.parent.x) + ctProperties.rectwidth - linkwidth / 2, y: -1 * (d.y - d.parent.y) + ctProperties.rowheight - 4};
            var pcontrol = {x: -1 * (d.x - d.parent.x) + ctProperties.rectwidth - linkwidth / 2, y: 0 + linkwidth / 2};
            var ptarget = {x: 0, y: 0 + linkwidth / 2};
            return bezier(psource, pcontrol, ptarget);
        }
        ;
    });
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
            .duration(duration)
            .style("fill-opacity", 1e-6)
            .attr("transform", function(d) {
        return "translate(" + source.x + "," + source.y + ")";
    })
            .remove();
    nodeExit.selectAll(".link_coltree")
            .attr("d", function(d) {
        if (d.parent !== null) {
            var o = {x: 0 + ctProperties.rectwidth - linkwidth / 2, y: 0 + rowheight - linkwidth / 2};
            return bezier(o, o, o); //function bezier(source_point,control_point,target_point,relative)
        }
        ;
    });
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
    
   //update + and - signs:
   updateExpandIcons();
   jumpToElementIfSpecified () ;
}

function updateExpandIcons(){
 
    d3.selectAll(".ctExpandlabel")
           .html(function(d) {
               if (d!=null){
      var rtext="";
       if (d.children!==null)
       {rtext = "&#x25bc;";} 
       else if (d._children!==null) 
       {rtext= "&#x25b6;";};
       if ((d.children===null && d._children.length===0)||(d._children===null && d.children.length===0))
       {rtext= "";}
    return rtext;
               }  }      
                   )
           .style ("font-size","8px")
           .attr("y",function(d){return ctProperties.rowheight/2;})
   .attr("x",function(d){var xpos=2;
       if (d.children!==null)
       {xpos=1;} 
       else if (d._children!==null) 
       {xpos=2;};
       if ((d.children===null && d._children.length===0)||(d._children===null && d.children.length===0))
       {xpos=2;}
    return xpos;}); //###hierweiter
  
    }
    

// Toggle children on clickCol.
function clickCol(d, textclicked) {
    if (CheckSelectionClick()) {return;}  //exit function if it was a panning click, instead of a selection click
    if (textclicked === undefined) {
        textclicked = false;
    }


    if (d.children) { //zuklappen
        //if collapsing, only perform selection update if the click was done on a text:

        if (textclicked) {
            updateSelectionGraphicsCol(d);
        }
        else //only collapse, if the rect was clicked
        {
            d._children = d.children;
            d.children = null;
            focusCol = null; //remove the selection and
            updateSelectionGraphicsCol(d); //update graphics
        }


    } else { //aufklappen
        d.children = d._children;
        d._children = null;
        //if expanding, always perform selection update:

        updateSelectionGraphicsCol(d);


    }
    //console.log(d);
    update(d);

    zoomListener.translate([100,-d.y+300]);
  //  console.log(d.x + "/" + d.y);
 zoomListener.event(vis.transition().duration(700));
        
        
   /*    vis.attr("transform",
          "translate(" + d.y + "," + d.x + ")"
          );*/
    
  
}


function updateSelectionGraphicsCol(d) {
   
    if (focusCol !== null) // a node was selected
    {
        if (focusCol !== d) //another node was selected --> change the focus to the new node:
        {
            focusCol = d;
            lastfocusID=focusCol.id;
                    sessionStorage.setItem('recentID',lastfocusID);
            //all nodes but the selected path are set transparent:
            //##1 first, get selected path:                  
            pathElements = getPathElementChain(d);
            //##2 adjust edge transparency:
            d3.selectAll("path").filter(function(d) {
                return this.classList.contains("link_coltree");
            })//get all links in the graph
                    //  .transition().duration(100)
                    .style("stroke", function(d) {
                if (pathElements.indexOf(d) != -1)
                {
                    return "black";
                }//element is in the active path
                else
                {
                    return d.initialPathColor;
                } // element is not in the active path
            });
                  
            //##3 adjust rect transparency
            d3.selectAll(".col_all_rects")
                    .style("fill-opacity", function(d) {
                if (focusCol===d ) //the focussed element
                {
                    return 1;
                }//element is not the focussed one
                else
                {return ctProperties.opacityAlternative;}
            });
              //##4 adjust text transparency
            d3.selectAll(".col_all_texts")
                    .style("fill-opacity", function(d) {
                if (focusCol===d ) //the focussed element
                {
                    return 1;
                }//element is not the focussed one
                else
                {return ctProperties.opacityAlternative;}
            });

        }
        else  // this node was selected before --> unselect it!
        {
            focusCol = null; //remove the focus
            //return all path colors to normal:
            d3.selectAll("path").filter(function(d) {
                return this.classList.contains("link_coltree");
            })//get all links in the graph
                    //   .transition().duration(100) 
                    .style("stroke", function(d) {
                return d.initialPathColor;
            })
                    .style("stroke-opacity", 1);
            
             //##3 adjust rect transparency
            d3.selectAll(".col_all_rects")            
                .style("fill-opacity", function(d) {
                if (this.classList.contains("colrect") ) //the focussed element
                {
                    return 1;
                }//element is not the focussed one
                else
                {return ctProperties.opacity;}
            });
            //##4 adjust text transparency
            d3.selectAll(".col_all_texts")
                    .style("fill-opacity", function(d) {
                if (this.classList.contains("coltext") ) //the focussed element
                {
                    return 1;
                }//element is not the focussed one
                else
                {return ctProperties.opacityAlternative;}
            });
               
            
        }
    }
    else //no node was selected previously --> set focus to the selected node
    {
        focusCol = d;
        lastfocusID=focusCol.id;
        sessionStorage.setItem('recentID',lastfocusID);
        //reset all other nodes:
        //all nodes but the selected path are set transparent:
        //##1 first, get selected path:
        pathElements = getPathElementChain(d);
        //##2 adjust edge transparency:
        d3.selectAll("path").filter(function(d) {
            return this.classList.contains("link_coltree");
        })//get all links in the graph
                //    .transition().duration(100)
                .style("stroke", function(d) {
            if (pathElements.indexOf(d) != -1)
            {
                return "black";
            }//element is in the active path
            else
            {
                return d.initialPathColor;
            } // element is not in the active path

        })
                .style("stroke-opacity", function(d) {
            if (pathElements.indexOf(d) != -1)
            {
                return 1;
            }//element is in the active path
            else
            {
                return 0.2;
            } // element is not in the active path
        });
        d3.selectAll(".col_all_rects")
                    .style("fill-opacity", function(d) {
                if (focusCol===d ) //the focussed element
                {
                    return 1;
                }//element is not the focussed one
                else
                {return ctProperties.opacityAlternative;}
            })
                    .style("stroke-opacity", function(d) {
                if (focusCol===d ) //the focussed element
                {
                    return 1;
                }
                else
                {
                    return ctProperties.opacityAlternative;
                } 
            });
            //##4 adjust text transparency
            d3.selectAll(".col_all_texts")
                    .style("fill-opacity", function(d) {
                if (focusCol===d ) //the focussed element
                {
                    return 1;
                }//element is not the focussed one
                else
                {return ctProperties.opacityAlternative;}
            });
    }
 
updatedetails(d);
}
function myTreeLayout(data) {
    //generates nodes and links
    var nodes = []; // or reuse data directly depending on layout
    //load all nodes and their subnodes:
    var coreelement = data;
    coreelement.x = 0;
    coreelement.y = 0;
    positions(coreelement, 0);
    //nodes.push(coreelement); //core element

    function child_recursion(element, parent) {
        element.parent = parent;
          //Additionally set the parent property for all alternative nodes:
            element.NodeAlternatives.forEach(function(alternativeObject) {
                alternativeObject.parent=parent;
                //no need for further recursion, as alternative objects never have children
            });
        
        nodes.push(element);
        if (element.children != null) {
            element.children.forEach(function(child) {
                //do not add child node, if it has alternatives and is red:
                var codearray = jQuery.makeArray(child.tags);
                if (!(typeof child.nodeAlternatives !== 'undefined' && child.nodeAlternatives.length > 0 && $.inArray(tags.Included, codearray) >= 0))
                {
                    if (filtered(child)==0) {
                    child_recursion(child, element);
                    }
                }
                ;
            });
        }
        //Additionally, add the parent attribute to the alternatives:
           if (typeof element.nodeAlternatives !== 'undefined')
              {
                element.nodeAlternatives.forEach(function(alternative) {
                    alternative.parent=parent;
               });
             }
    }

    child_recursion(coreelement, coreelement);
    coreelement.parent = null;
    appendSearchIDToAllNodes(coreelement,"");
    return nodes;
}

function positions(d, pos_y) { //pos_y is the target position (y) of the element
    var sum_y;
    sum_y = rowheight; //the sum of all vertical space used by that element
    if (d.parent != null)
    {
        d.x = d.parent.x + 20;
    }
    else
    {
        d.x = 0;
    }
    d.y = pos_y;
    if (d.children) {
        d.children.forEach(function(child) {
            child.parent = d;
            if (filtered(child)==0) {
            sum_y += positions(child, pos_y + sum_y);
             }
        });
    }
    return sum_y;
}

function return_fill_class(d)
{

    var codearray = jQuery.makeArray(d.tags);
    if ($.inArray(tags.NotIncluded, codearray) >= 0)
    {
        return 'nichtEmpfohlen_Fill';
    }
    else if ($.inArray(tags.Extended, codearray) >= 0)
    {
        return 'erweiterungsteil_Fill';
    }
    
    else if ($.inArray(tags.Schale, codearray) >= 0)
    {
        return 'empfohlenSchale_Fill';
    }
    else if ($.inArray(tags.Included, codearray) >= 0)
    {
        return 'empfohlen_Fill';
    }
    else
    {
        return "#FEFEFE";
    }
}





   