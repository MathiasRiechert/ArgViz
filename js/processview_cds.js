/*processcontainer
 process_chart*/
var procProperties = {};
procProperties['internal_padding'] = 10; // 5 px above and 5 below
procProperties['header_height'] = 40; // header for the name element
procProperties['header_min_height_arbeitspaket'] = 40; // header for the name element
procProperties['workpackage_header_height'] = 100; // header for the name element of the work packages
procProperties['group_width'] = 200; // width of the group pane
procProperties['zeitraum_label_width'] = 20; // width of the group pane
procProperties['arbeitspakete_label_height'] = 18; // width of the group pane
procProperties['expertise_width'] = 200; // width of the expertise pane
procProperties['expertise_space'] = 20; // width of the expertise pane
var visproc;
var rootproc;
var expertise_intern_shown=false;
var expertise_extern_shown=false;

    function isDefined(val){
  if(typeof(val)  === "undefined") 
  {return false;}
  else
  { if (val!=="")
      {return false;}
      else
       {return true;}
   }
}


$(document).ready(function() {
    $('#process_chart').mousedown(function() {
      
           
 $(this).css('cursor', 'move');
    });
    $('#process_chart').mouseup(function() {
    
            
 $(this).css('cursor', 'auto');
    });



});

if (selectedslide == 0)//only if the first slide is shown
{
    var margin = {top: 20, right: 120, bottom: 20, left: 20},
    width = 4000 - margin.right - margin.left,
            height = 1000 - margin.top - margin.bottom;
    var i = 0,
            duration = 450;
    var diagonal = d3.svg.diagonal()
            .projection(function (d) {
                return [d.y, d.x];
            });
  var spinbox = document.getElementById('process_chart');
    var spinner = new Spinner(opts).spin(spinbox); //shows the waiting animation

d3.ns.prefix.xmlns = "http://www.w3.org/2000/svg";

    visproc = d3.select("#process_chart").append("svg:svg")
           
            .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
  
    d3.json("data/gesamtablauf.json", function (error, data) {

        rootproc = data;
        rootproc.x0 = 0;
        rootproc.y0 = 0;
        collapseExpertise(rootproc);
        updateproc(rootproc);
           
        spinner.stop(); //removes the waiting animation
    });

}



function updateproc(source) {
    //computes the process layout:
    var nodes = myProcessLayout(rootproc);
    var node = visproc.selectAll("g.processnode")
            //    .data(nodes , function(d) { return d.Nodeid; });
            .data(nodes, function (d) {
                return d.id || (d.id = ++i)
            });
    var nodeEnter = node.enter().append("g").filter(function (d) {
        return (d.level == "zeitraum" || d.level == "expertengruppe" || d.level == "ergebnis" || d.level == "arbeitspaket" || d.level=="expertise_intern" || d.level=="expertise_extern");
    })
            .classed("processnode", true)
            .attr("transform", function (d) {
                if (d.x!=null && d.y!=null)
                {
                    return "translate(" + d.x + "," + d.y + ")";
                }
     });
            
            d3.select(  nodeEnter).transition()     
    
            .each("start", function(d) { this.style("opacity",1e-6); })
             .each("end", function(d) { this.style("opacity",1); });
            
    //##### Add Element Path:
    nodeEnter.filter(function (d) {
        return(d.level == "zeitraum") //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:polyline")
            .attr("points", function (d) {
                var p1x = procProperties.zeitraum_label_width + 9;
                var p1y = 0;
                var p2x = procProperties.zeitraum_label_width;
                var p2y = 0;
                var p3x = procProperties.zeitraum_label_width;
                var p3y = d.sum_y;
                var p4x = procProperties.zeitraum_label_width + 9;
                var p4y = d.sum_y;
                return p1x + "," + p1y + " " + p2x + "," + p2y + " " + p3x + "," + p3y + " " + p4x + "," + p4y;
            })
            .classed("zeitraumLine", true);

    nodeEnter.filter(function (d) {
        return(d.level == "zeitraum") //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:text")
            .attr("class", "zeitraumText")
            .attr("y", function (d) {
                return d.sum_y / 2;
            })
            .text(function (d) {
                return d.name;
            })
            .attr("transform", function (d) {
                return "rotate(270 " + (procProperties.zeitraum_label_width / 2 - 10) + "," + (d.sum_y / 2 - 15) + ")";
            });

    nodeEnter.filter(function (d) {
        return(d.level == "expertengruppe") //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:rect")
            .attr("id", function(d){
                if (d.name=='Projektgruppe "Definitionen und Datenformate"')
        {   return "PGD";}
            })
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.group_width)
            .attr("height", procProperties.header_height)
              .on("click", function (d) {
                clickProc(d);
            })
            .classed("BoxHeader", true);




    nodeEnter.filter(function (d) {
        return(d.level == "expertengruppe") //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:rect")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.group_width)
            .attr("height", function (d) {
                return d.sum_y;
            })
            .attr("class","zeitraumLine");
    nodeEnter.filter(function (d) {
        return(d.level == "expertengruppe")
    }).append("svg:text")
            .attr("class", "ProcHeaderText")
            .attr("x", procProperties.group_width / 2)
            .attr("y", procProperties.header_height / 2)
                .on("click", function (d) {
                clickProc(d);
            })
            .text(function (d) {
                return d.name;

            });
    // d3.selectAll(".ProcHeaderText").call (procwrap,procProperties.group_width-procProperties.internal_padding);
    nodeEnter.filter(function (d) {
        return(d.level == "expertengruppe")
    }).append("svg:text")
            .classed("procLabelText", true)
            .attr("x", 0.5 * procProperties.internal_padding)
            .attr("y", procProperties.header_height + 1.5 * procProperties.internal_padding)
  
            .text("Arbeitspakete:");

    nodeEnter.filter(function (d) {
        return(d.level == "arbeitspaket")
    }).append("svg:rect")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.group_width - procProperties.internal_padding)
            .attr("height", function (d) {
                return d.headerHeight;
            })
 
            .classed("BoxHeaderArbeitspaket", true);
    nodeEnter.filter(function (d) {
        return(d.level == "arbeitspaket" && d.ergebnisse.length > 0) //additionally check, if there are no results! 
    }).append("svg:rect")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.group_width - procProperties.internal_padding)
            .attr("height", function (d) {
                return d.sum_y;
            })
            
            .classed("zeitraumLine", true);
    nodeEnter.filter(function (d) {
        return(d.level == "arbeitspaket")
    }).append("svg:text")
            .attr("class", "ProcHeaderTextArbeitspaket")
            .attr("x", procProperties.group_width / 2 - procProperties.internal_padding * 2)
            .attr("y", procProperties.header_min_height_arbeitspaket / 2)
            .on("click", function (d) {
                clickProc(d);
            })
            .text(function (d) {
                return d.name;

            });
    nodeEnter.filter(function (d) {
        return(d.level == "arbeitspaket" && d.ergebnisse.length > 0) //additionally check, if there are no results!
    }).append("svg:text")
            .classed("procLabelText", true)
            .attr("x", 0.5 * procProperties.internal_padding)
            .attr("y", function (d) {
                return d.headerHeight + 1.5 * procProperties.internal_padding;
            })
            .text(function(d){return d.ergebnisse?"Ergebnisse:":""});


        nodeEnter.filter(function (d) {
        return(d.level == "ergebnis" )
    })
            .append("svg:text")
            .attr("class", "ProcHeaderTextArbeitspaket")
           
            .attr("x", procProperties.group_width / 2 - procProperties.internal_padding * 2)
            .attr("y", procProperties.header_min_height_arbeitspaket / 2)
            .text(function (d) {
                return d.name;

            })
            
    ;

    nodeEnter.filter(function (d) {
        return(d.level == "ergebnis"&& !isDefined(d.link))
    }).append("svg:a")
            .attr("target","_blank")
            .attr("xlink:href", function(d){return d.link;})
            .append("svg:rect")
            .style("fill","rgba(255,255,255, 0.001)")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.group_width - 2 * procProperties.internal_padding)
            .attr("height", function (d) {
                return d.sum_y;
            })
            
            .classed("zeitraumLine", true)
    
    ;
    
    
     nodeEnter.filter(function (d) {
        return(d.level == "ergebnis"&&isDefined(d.link))
    })    .append("svg:rect")
            .style("fill","rgba(255,255,255, 0.001)")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.group_width - 2 * procProperties.internal_padding)
            .attr("height", function (d) {
                return d.sum_y;
            })
            
            .classed("zeitraumLine", true);
    
    
            //now add internal expertise:

    nodeEnter.filter(function (d) {
        return(d.level == "expertise_intern") 
    }).append("svg:rect")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.expertise_width - procProperties.internal_padding)
            .attr("height", function (d) {
                return d.sum_y;
            })
            .on("mouseover", function(d) {
                        procupdatedetails(d); 
                })
             .on ("mouseout",function(d) {
                      procupdatedetails(null); 
                        })
            .classed("BoxExpertise", true)
    ;
    
    //add internal_expertise header when entering:

nodeEnter.filter(function (d) {
        return(d.level == "expertise_intern" && !expertise_intern_shown) //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:rect")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                expertise_intern_shown=true;
                return -d.y+d.parent.y+d.parent.pos_y_expertise_intern_header;
            })
            .attr("width", procProperties.expertise_width- procProperties.internal_padding)
            .attr("height", procProperties.header_height)  
            .classed("header_internal_expertise", true);
  nodeEnter.filter(function (d) {
        return(d.level == "expertise_intern") //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:polygon")
            .attr("points", function (d) {
                var posheader= -d.y+d.parent.y+d.parent.pos_y_expertise_intern_header;
                var iconspacing=6;
                var x1=-procProperties.expertise_space;
                var y1=posheader+0.5*procProperties.header_height;
                var x2=-iconspacing;
                var y2=posheader+iconspacing;
                var x3=-iconspacing;
                var y3=posheader+procProperties.header_height-iconspacing;
                
                return x1 + ","+ y1 + " " + x2 + ","+ y2 + " " +x3 + ","+ y3;
            })       
            .classed("header_internal_expertise", true);
  
   
    nodeEnter.filter(function (d) {
        return(d.level == "expertise_intern")
    }).append("svg:text")
            .attr("class", "ExpertiseHeaderText")
            .attr("x", (procProperties.expertise_width- procProperties.internal_padding) / 2)
            .attr("y", function(d){ return -d.y+d.parent.y+d.parent.pos_y_expertise_intern_header + procProperties.header_height / 2;})
            .text("Interne Projektgruppenbeteiligung");
    
    nodeEnter.filter(function (d) {
        return(d.level == "expertise_intern")
    }).append("svg:text")
            .attr("class", "procTextExpertise")
            .attr("x", procProperties.expertise_width / 2 - procProperties.internal_padding * 2)
            .attr("y", procProperties.header_height / 2)
         .on("mouseover", function(d) {
                        procupdatedetails(d); 
                })
         
            .text(function (d) {
                return d.name;

            });
            
             //now add external expertise:

    nodeEnter.filter(function (d) {
        return(d.level == "expertise_extern") 
    }).append("svg:rect")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .attr("width", procProperties.expertise_width - procProperties.internal_padding)
            .attr("height", function (d) {
                return d.sum_y;
            })
  .on("mouseover", function(d) {
                        procupdatedetails(d); 
                })
                .on ("mouseout",function(d) {
                      procupdatedetails(null); 
                        })
            .classed("BoxExpertise", true)
    ;


nodeEnter.filter(function (d) {
        return(d.level == "expertise_extern" && !expertise_extern_shown) //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:rect")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                expertise_extern_shown=true;
                return -d.y+d.parent.y+d.parent.pos_y_expertise_extern_header;
            })
            .attr("width", procProperties.expertise_width- procProperties.internal_padding)
            .attr("height", procProperties.header_height)  
            .classed("header_internal_expertise", true);
  nodeEnter.filter(function (d) {
        return(d.level == "expertise_extern") //muss ein zeitraum sein, nur die haben expertengruppen
    }).append("svg:polygon")
            .attr("points", function (d) {
                var posheader= -d.y+d.parent.y+d.parent.pos_y_expertise_intern_header;
                var iconspacing=6;
                var x1=-procProperties.expertise_space;
                var y1=posheader+0.5*procProperties.header_height+d.parent.pos_y_expertise_extern_header;
                var x2=-iconspacing;
                var y2=posheader+iconspacing+d.parent.pos_y_expertise_extern_header;
                var x3=-iconspacing;
                var y3=posheader+procProperties.header_height-iconspacing+d.parent.pos_y_expertise_extern_header;
                
                return x1 + ","+ y1 + " " + x2 + ","+ y2 + " " +x3 + ","+ y3;
            })       
            .classed("header_internal_expertise", true);
  
   
    nodeEnter.filter(function (d) {
        return(d.level == "expertise_extern")
    }).append("svg:text")
            .attr("class", "ExpertiseHeaderText")
            .attr("x", (procProperties.expertise_width- procProperties.internal_padding) / 2)
            .attr("y", function(d){ return -d.y+d.parent.y+d.parent.pos_y_expertise_extern_header + procProperties.header_height /2;})
            .text("Externe Projektruppenbeteiligung");
    
    nodeEnter.filter(function (d) {
        return(d.level == "expertise_extern")
    }).append("svg:text")
            .attr("class", "procTextExpertise")
            .attr("x", procProperties.expertise_width / 2 - procProperties.internal_padding * 2)
            .attr("y", procProperties.header_height / 2)
         .on("mouseover", function(d) {
                        procupdatedetails(d); 
                })
            .text(function (d) {
                return d.name;

            });
   

    d3.selectAll(".procTextExpertise").call(procwrap, procProperties.expertise_width - 2*procProperties.internal_padding);
    d3.selectAll(".ProcHeaderText").call(procwrap, procProperties.group_width - procProperties.internal_padding);
    d3.selectAll(".ProcHeaderTextArbeitspaket").call(procwrapAutoHeight);



 var nodeUpdate = node.transition()
            .duration(duration)
            .style("fill-opacity", 1)
            .attr("transform", function(d) {
                if (d.x!=null && d.y!=null) {
        return "translate(" + d.x + "," + d.y + ")";
                }
    })
            .each("start", function(d) {

        /*vis.selectAll(".coltext_argument").remove();
        vis.selectAll(".colrect_argumentpro").remove();
        vis.selectAll(".colrect_argumentcon").remove(); //remove all shown arguments!
        vis.selectAll(".coltext_alternative").remove(); //remove all shown alternatives!
        vis.selectAll(".colrect_alternative").remove(); //remove all shown alternatives!
        vis.selectAll(".alternative-text_coltree").remove(); //remove all shown alternatives! */

    })
            .each("end", function(d) {
       /* showalternativesColTree(d);
        showargumentsColTree(d);*/
    })
            ;
            
  

    /*nodeUpdate.selectAll(".zeitraumLine")
            .attr("height", function(d) {return d.sum_y;  });
        nodeUpdate.selectAll(".procLabelText")
                .each("start",function(d){this.style.display = "none";})
                .each("end",function(d){this.style.display = "inline";})*/
       
 
    
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
            .duration(350)
            .style("fill-opacity", 1e-6)
            .style("stroke-opacity", 1e-6)
      //      .attr("transform", function(d) {
   //     return "translate(" + d.parent.x + "," + d.parent.y + ")";
  //  })
            .remove();
    nodeExit.selectAll(".procTextExpertise")
            .attr("opacity", 1e-6);
  
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });



}

function appendMultilineText(nodeEnter) {


    nodeEnter.filter(function (d) {
        return(d.level == "expertengruppe")
    }).append("svg:text")
            .attr("class", "ProcHeaderText")
            .attr("x", procProperties.group_width / 2)
            .attr("y", 0)
            .text(function (d) {
                return d.name;

            });



}
function procwrapAutoHeight(text) {
    var posx = 0.5 * procProperties.internal_padding;
    text.each(function (d) {
      if(!d.wordsFitted) {
        var width = 0;
        if (d.level == "arbeitspaket") {
            width = procProperties.group_width - 2 * procProperties.internal_padding;
        }
        if (d.level == "ergebnis") {
            width = procProperties.group_width - 3 * procProperties.internal_padding;
        }
        var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = procProperties.header_height * (1.2 / 3);//text.attr("y"),
        dy = parseFloat(text.attr("dy"));
        if (isNaN(dy)) {
            dy = 0;
        }
        var tspan = text.text(null).append("tspan").attr("x", posx).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", posx).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }

        }
        d.wordsFitted=true;
    }
    });
}
function procwrap(text, width) {
    var posx = procProperties.group_width / 2;
    text.each(function (d) {
        if (d.level == "expertise_intern" || d.level=="expertise_extern") {
             posx = procProperties.internal_padding*0.5;
             
        }
        if(!d.wordsFitted || d.level == "expertise_intern"|| d.level=="expertise_extern") {
            
        
        var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = procProperties.header_height * (1.2 / 3);//text.attr("y"),
        dy = parseFloat(text.attr("dy"));
        if (isNaN(dy)) {
            dy = 0;
        }
        var tspan = text.text(null).append("tspan").attr("x", posx).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", posx).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }

        }
        d.wordsFitted=true;
    }
        });
  
}
function myProcessLayout(data) {
    /*hierarchical structure: 
     * rootproc>
     *  -zeitraum()>
     *      -name
     *      -expertengruppe()>
     *          -name
     *          -expertise_intern()>
     *              -name
     *              -mitglieder()>
     *                  -name
     *                  -institution
     *          -expertise_extern()>
     *              -name
     *              -mitglieder()>
     *                  -name
     *                  -institution
     *          -arbeitspakete()>
     *              -name
     *              -ergebnisse()>
     *                  -name
     *                  -link
     *      */
    //generates nodes and links
    var nodes = []; // or reuse data directly depending on layout
    //load all nodes and their subnodes:
    var coreelement = data;
    coreelement.x = 0;
    coreelement.y = 0;
    positionsproc(coreelement, 0);
    //nodes.push(coreelement); //core element

    function positionsproc(d) {
        var sum_y_total;
        sum_y_total = 0;
        d.x = 0;
        d.y = 0;
        if (d.zeitraum) {
            var sum_y_zeitraum_total = 0;
            var sum_y_expertise_total=0;
            d.zeitraum.forEach(function (zeitraum) {
                var sum_y_zeitraum_temp = 100; //show 100 minimally. This value is not added up, but only the largest number in the row is taken
                var sum_x_expertengruppen = 0;
                zeitraum.level = "zeitraum";
                zeitraum.x = 0;
                zeitraum.y = sum_y_zeitraum_total;
                zeitraum.expertengruppe.forEach(function (expertengruppe) {

                    expertengruppe.x = procProperties.zeitraum_label_width + sum_x_expertengruppen + procProperties.internal_padding / 2;
                    expertengruppe.y = zeitraum.y + procProperties.internal_padding / 2;
                    expertengruppe.level = "expertengruppe";
                    var sum_y_arbeitspaket_total = procProperties.arbeitspakete_label_height; //leave space for the first label in the workgroups
                    if (expertengruppe.arbeitspakete) {
                    expertengruppe.arbeitspakete.forEach(function (arbeitspaket) {

                        var sum_y_arbeitspaket_temp = 0;
                        var arbeitspaket_header_height = procProperties.header_min_height_arbeitspaket;
                        var textsize = Math.log(arbeitspaket.name.length) * 4.1 + arbeitspaket.name.length / 2.9;
                        if (arbeitspaket_header_height < textsize) {
                            arbeitspaket_header_height = textsize;
                        }
                        arbeitspaket.headerHeight = arbeitspaket_header_height;
                        arbeitspaket.x = expertengruppe.x + procProperties.internal_padding / 2;
                        arbeitspaket.y = expertengruppe.y + sum_y_arbeitspaket_total + procProperties.header_height + procProperties.internal_padding / 2;
                        arbeitspaket.level = "arbeitspaket";

                        var sum_y_ergebnis_total = 0;//procProperties.arbeitspakete_label_height; //leave space for the first label in the work packages
                        if (arbeitspaket.ergebnisse) {
                        arbeitspaket.ergebnisse.forEach(function (ergebnis) {
                            var sum_y_ergebnis_temp = 0;
                            var ergebnis_label_height = 0;//procProperties.header_min_height_arbeitspaket;
                            var textsize_ergebnis = ergebnis.name.length / 3;//+Math.log(ergebnis.name.length)*2//Math.log(ergebnis.name.length)*3.1+ergebnis.name.length/4.9;
                            if (ergebnis_label_height < textsize_ergebnis) {
                                ergebnis_label_height = textsize_ergebnis;
                            }
                            ergebnis.labelHeight = ergebnis_label_height;
                            ergebnis.x = arbeitspaket.x + procProperties.internal_padding / 2;
                            ergebnis.y = arbeitspaket.y + sum_y_ergebnis_total + procProperties.arbeitspakete_label_height + arbeitspaket.headerHeight + procProperties.internal_padding / 2;
                            ergebnis.level = "ergebnis";


                            sum_y_ergebnis_temp = ergebnis.labelHeight;
                            sum_y_ergebnis_total = sum_y_ergebnis_total + sum_y_ergebnis_temp + 2.5 * procProperties.internal_padding;
                            ergebnis.sum_y = sum_y_ergebnis_temp + 2 * procProperties.internal_padding;
                        })}
                        if (!arbeitspaket.ergebnisse) {sum_y_arbeitspaket_total = 0} 
                        else if (arbeitspaket.ergebnisse.length < 1) {//Special case: there are no results --> don't show label
                            sum_y_arbeitspaket_total = sum_y_arbeitspaket_total - procProperties.arbeitspakete_label_height;
                            // sum_y_ergebnis_total=sum_y_ergebnis_total- procProperties.arbeitspakete_label_height;
                        }
                        sum_y_arbeitspaket_temp = sum_y_ergebnis_total + arbeitspaket.headerHeight + 0.3 * procProperties.internal_padding;
                        sum_y_arbeitspaket_total = sum_y_arbeitspaket_total + sum_y_arbeitspaket_temp + 2.5 * procProperties.internal_padding;
                        arbeitspaket.sum_y = sum_y_arbeitspaket_temp + 2 * procProperties.internal_padding;
                    })}
                    //now add the expertise:
                    var sum_y_expertise=procProperties.header_height;
                    if (expertengruppe.expertise_intern) {
                    expertengruppe.pos_y_expertise_intern_header=0;
                    expertengruppe.expertise_intern.forEach(function (expertise_intern) {
                        expertengruppe.expertise_intern_shown=true;
                        expertise_intern.level="expertise_intern";
                        expertise_intern.x=expertengruppe.x+procProperties.group_width+ procProperties.internal_padding / 2 +procProperties.expertise_space;
                        expertise_intern.y=expertengruppe.y+sum_y_expertise;
                        
                        expertise_intern.sum_y=procProperties.header_height;
                        sum_y_expertise=sum_y_expertise+procProperties.header_height;
                        
                        if(sum_y_expertise+procProperties.internal_padding>sum_y_expertise_total) {sum_y_expertise_total=sum_y_expertise+procProperties.internal_padding;}
                    })
                    }
                   
                    if (expertengruppe.expertise_intern_shown) {
                         //add space for another heading (external):
                        sum_y_expertise=sum_y_expertise+procProperties.internal_padding+procProperties.header_height; //geändert am 13.01.
                    }

                   //add external expertise:
                    if (expertengruppe.expertise_extern) {
                    if (expertengruppe.expertise_intern_shown) {
                     expertengruppe.pos_y_expertise_extern_header=sum_y_expertise-procProperties.header_height;
                    }else
                    {
                        expertengruppe.pos_y_expertise_extern_header=0;  
                    }
                  
                    expertengruppe.expertise_extern.forEach(function (expertise_extern) {
                        expertise_extern.level="expertise_extern";
                        expertise_extern.x=expertengruppe.x+procProperties.group_width+ procProperties.internal_padding / 2 +procProperties.expertise_space;
                        expertise_extern.y=expertengruppe.y+sum_y_expertise;
                        
                        expertise_extern.sum_y=procProperties.header_height;
                        sum_y_expertise=sum_y_expertise+procProperties.header_height;
                      
                        if(sum_y_expertise+procProperties.internal_padding>sum_y_expertise_total) {sum_y_expertise_total=sum_y_expertise+procProperties.internal_padding;}
                    })
                    }
                    
                    
                    //before adding the sum_x of all expert groups, check if internal or external expertise is displayed:
                    if (expertengruppe.expertise_intern ||expertengruppe.expertise_extern)
                    {
                       
                            sum_x_expertengruppen=sum_x_expertengruppen+procProperties.expertise_width+procProperties.expertise_space;
                      
                    }
                    sum_x_expertengruppen = sum_x_expertengruppen + procProperties.group_width + procProperties.internal_padding / 2;
                    sum_y_expertengruppe = sum_y_arbeitspaket_total  +3.5 * procProperties.internal_padding;
                    //finally: return used vertical space:
                    if (sum_y_zeitraum_temp < sum_y_expertengruppe) {
                        sum_y_zeitraum_temp = sum_y_expertengruppe;
                    }
                    expertengruppe.sum_y = sum_y_expertengruppe + procProperties.internal_padding;
                })
                sum_y_zeitraum_total = sum_y_zeitraum_total + sum_y_zeitraum_temp + 3 * procProperties.internal_padding;
                if (sum_y_zeitraum_total<sum_y_expertise_total) {sum_y_zeitraum_total=sum_y_expertise_total;}
                zeitraum.sum_y = sum_y_zeitraum_temp + 2 * procProperties.internal_padding;
       

            })
        }
    }



    function child_recursionproc(element, parent) {
        element.parent = parent;
        nodes.push(element);
        if (element.zeitraum != null) {
            element.zeitraum.forEach(function (zeitraum) {
                child_recursionproc(zeitraum, element);
            });
        }
        if (element.expertengruppe != null) {
            element.expertengruppe.forEach(function (expertengruppe) {
                child_recursionproc(expertengruppe, element);
            });
        }
        if (element.expertise_intern != null) {
            element.expertise_intern.forEach(function (expertise_intern) {
                child_recursionproc(expertise_intern, element);
            });
        }
        if (element.expertise_extern != null) {
            element.expertise_extern.forEach(function (expertise_extern) {
                child_recursionproc(expertise_extern, element);
            });
        }
        if (element.mitglieder != null) {
            element.mitglieder.forEach(function (mitglieder) {
                child_recursionproc(mitglieder, element);
            });
        }
        if (element.arbeitspakete != null) {
            element.arbeitspakete.forEach(function (arbeitspakete) {
                child_recursionproc(arbeitspakete, element);
            });
        }
        if (element.ergebnisse != null) {
            element.ergebnisse.forEach(function (ergebnisse) {
                child_recursionproc(ergebnisse, element);
            });
        }
    }

    child_recursionproc(coreelement, coreelement);
    coreelement.parent = null;
    return nodes;
}

function collapseExpertise(d,excludedNode) {
    
    if (d.zeitraum) {
        if (d.zeitraum.length>0)
        {
            d.zeitraum.forEach(function(zeitraum){
               collapseExpertise(zeitraum,excludedNode); 
               return;
            })
        }
    }
       if (d.expertengruppe) {
        if (d.expertengruppe.length>0)
        {
            d.expertengruppe.forEach(function(expertengruppe){
               collapseExpertise(expertengruppe,excludedNode); 
               return;
            })
        } 
    }
        //if we reached this point in the recursion, then it is a expertise node
        //first check if there are arrays with zero lenght --> set them null:
        if (d.expertise_intern && d.expertise_intern.length==0) {d.expertise_intern=null; 
            } 
        if (d.expertise_extern && d.expertise_extern.length==0) {d.expertise_extern=null; 
            } 
        // 
        //   for the remaining cases: collapse expertises:
        
       
            if (d!=excludedNode){
                if (d.expertise_intern) {
                    d._expertise_intern = d.expertise_intern;
                d.expertise_intern = null;
                expertise_intern_shown=false;
            }
                if (d.expertise_extern) {
                 d._expertise_extern = d.expertise_extern;
                d.expertise_extern = null;
                expertise_extern_shown=false;
            }
                
            }
            
        
        
      
    }

// Toggle children on clickProc.
function clickProc(d, textclicked) {
    
    if (CheckSelectionClick()) {
        return;
    }  //exit function if it was a panning click, instead of a selection click
    
    
    if (d.expertise_intern) {//zuklappen
         d._expertise_intern = d.expertise_intern;
         d.expertise_intern = null;
         expertise_intern_shown=false;
        
       
    } else { //aufklappen
        d.expertise_intern = d._expertise_intern;
        d._expertise_intern = null;
     
    }
     if (d.expertise_extern) {//zuklappen
         d._expertise_extern = d.expertise_extern;
         d.expertise_extern = null;
         expertise_extern_shown=false;
        
       
    } else { //aufklappen
        d.expertise_extern = d._expertise_extern;
        d._expertise_extern = null;
     
    }
    collapseExpertise(getRoot(d),d);
   // console.log(d);
    updateproc(d);




    /*    vis.attr("transform",
     "translate(" + d.y + "," + d.x + ")"
     );*/


}

function procupdatedetails(d) {
    if (d==null)
    { $$('beteiligte').setHTML("");}
    else
    {if (d.mitglieder)
    {
        if (d.mitglieder.length>0)
        {
            var outputtext="<table>";
            d.mitglieder.forEach(function(mitglied) {
        
                outputtext+="<tr><td colspan = '2'><span style='color:black'>" +mitglied.name + "</span></td></tr>";
                if (mitglied.institution)
                {
                    if (mitglied.institution.length>0)
                    {
                        outputtext+="<tr><td width=10><span style='font-size:0.9em;'>&rdsh;</span></td><td>"+mitglied.institution + "</td></tr>";
                
                    }
                }
                
            })
            outputtext+="</table>";
                $$('beteiligte').setHTML(outputtext);
        }
            else
    {   $$('beteiligte').setHTML("");}
    }
    else
    {   $$('beteiligte').setHTML("");}
    


}}