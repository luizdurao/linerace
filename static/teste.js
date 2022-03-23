Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var R = [];
        for (var i = 0; i < this.length; i += 1)
            R.push(this.slice(i, i + chunkSize));
        return R;
    }
}); 

function line2(type1, type2, tickDuration, yearStart, yearStop,name1,name2,total){

    var type1 = String(type1);
    var type2 = String(type2);
    var name1 = String(name1)
    var name2 = String(name2)

    
    var margin = {top: 20, right: 60, bottom: 20, left: 80},
        width = 1110 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;
    
    duration = 1000/tickDuration;
    
    yearStart=new Date(yearStart);
    yearStop=new Date(yearStop);
    
    // main content holder
    var svg = d3.select("#graph")
        .append("svg")
        .style("background", "#fff")
        .style("color", "#fff")
        .attr("width", width + margin.left + margin.right )
        .attr("height", height + margin.top + margin.bottom + 100 )
        .attr("class","graph-svg-component")
        .attr("fill", "currentColor")
        .attr("class","shadow")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .append("g")
        .attr("transform","translate(" + (margin.left + 50)+ "," + (margin.top + 40) + ")"); 
       
    
    // background grey    
    svg.append("rect")
          .attr("x",0)
          .attr("y",35)
          .attr("height", height-30)
          .attr("width", width-100)
          .style("fill","#e5e5e5")
          .style("opacity", 0.01)  ;
      
    
    // clip paths
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x",10)
        .attr("y",35)
        .attr("width", width)
        .attr("height", height-30);  
    
    svg.append("defs")
        .append("clipPath")
        .attr("id", "yaxisclip")
        .append("rect")
        .attr("x",-90)
        .attr("y",30)
        .attr("width", width)
        .attr("height", height);  
        
    svg.append("defs")
        .append("clipPath")
        .attr("id", "xaxisclip")
        .append("rect")
        .attr("x",0)
        .attr("y",-(height-30))
        .attr("width", width-90)
        .attr("height", height+100);     
    
    // title of the chart    
    svg.append("text")
        .attr("class","title")
        .attr("x", (margin.left + width - margin.right) / 2)
        .attr("y", margin.top - 40)
        .attr("dy", 10)
        .attr("text-anchor", "middle")
        .style("fill","black")
        .call(text => text.append("tspan").attr("font-size","21px").attr("fill","#021B79").attr("font-weight", "bold").text("\xa0"+name1+"\xa0"))
        .call(text => text.append("tspan").attr("font-size","21px").attr("font-weight", "bold").text("\xa0 & \xa0"))
        .call(text => text.append("tspan").attr("font-size","21px").attr("fill","#c21500").attr("font-weight", "bold").text("\xa0"+name2+"\xa0"))
         

    // time format    
    var monthFormat = d3.timeFormat("%Y")
    
    var color = d3.scaleOrdinal(d3.schemeTableau10)
    

    if(total){
        filep = "/static/total_citation.json"
    }
    else{
        filep = "/static/teste6.json"
    }
    
    d3.json(filep).then(function(data){
        document.getElementById("gif").style.display='none';
        document.getElementById("divsvg").style.display='block'; 
       
        var case_types = [{'id':String(type1),"title":String(type1),"color":["#0080FE"]},
                        {'id':String(type2),"title":String(type2),"color":["#ED2939"]}]     
        
    
        color.domain(d3.keys(data[0]).filter(function(key) {
            return key !== "date";
        }));
    
        // extract coloumn names
        var names =  d3.keys(data[0]).filter(function(key){
            return key !== "date" && (key===type1 || key===type2);
        });

        //console.log("col name:",names);   
        
        data = data.filter(function(t){
            if(new Date(t.date).getTime() >= yearStart.getTime() && new Date(t.date).getTime() <=yearStop.getTime()){
                return t
            }
        })
        // create chunked data
        final = data.chunk(5)
        //console.log("after chunk :",final);
    
       
        // format dataset to be input in the line creation function
        final = final.map(function(d){
    
            countries  =  names.map(function(name){
                return{
                    name: name,
                    value: d.map(function(t){
                        return{
                            date: new Date(t.date),
                            cases:!isNaN(t[name])? +t[name]:0
                            
                        };
                    })
                }
            });
    
            return countries;
        })
    
        //console.log(final)
    
        // create color gradients
        for(i in names){
            
            var linearGradient = svg.append("defs")
            .append("linearGradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("id", "linear-gradient-"+case_types.find(e=>e.id===names[i]).id);
    
            //.attr("gradientTransform", "rotate(45)");
            linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", case_types.find(e=>e.id===names[i]).color[0]);
    
    
        }

        //console.log(linearGradient)
        // initialize the line :
        line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d){
                //console.log("line x:",x(new Date(d.date))); 
                return x(d.date);
            })
            .y(function(d){
                //console.log("line y:",y(d.cases));
                if (d.cases > 0){
                    return y(d.cases);
                }else{
                    return y(0)
                }
                
        });
    
       // Initialise a X axis:
        x = d3.scaleTime()
            .range([0, width - 150])
        
        var xAxis = d3.axisBottom()
                .scale(x)
                .ticks(d3.timeYear.every(4))
                //.tickFormat(d3.timeFormat("%d %b"))
                .tickFormat(d3.timeFormat("%Y"))
                .tickSizeInner(-height)
                .tickPadding(10)
    
        svg.append("g")
            .attr("transform", `translate(10,${height})`)
            .attr("class","x axis")
            .attr("clip-path", "url(#xaxisclip)")
            .call(xAxis);   
    
        // Initialize an Y axis
        y = d3.scaleLinear().domain([-2,1])
                .range([height , 2 * margin.top]);
        
                var yAxis = d3.axisLeft()
                    .scale(y)
                    .ticks(8)
                    //.tickSizeInner(-(width-100));
        svg.append("g")
            .attr("transform", `translate(10,0)`)
            .attr("class","y axis") 
            .attr("clip-path", "url(#yaxisclip)")           
    
    
        var t = final[0][0].value
        var month = monthFormat(t[t.length-1].date)
    
    
    
        let monthTxt =  svg.append("text")
            .attr("x",  (width)/2-50)
            .attr("y", height+50)
            .attr("dy", 10)
            .attr("text-anchor", "middle")
            .style("fill","black")
            .attr("font-weight", "bold")
            .attr("fill-opacity",0.0)
            .attr("font-size","16px")
            .text("← \xa0 "+month+" \xa0 →" );
        

        if (total){
            svg.append("text")
            .attr("x",  -300)
            .attr("y", -80)
            .attr("text-anchor", "middle")
            .style("fill","black")
            .attr("font-weight", "regular")
            .attr("fill-opacity",0.7)
            .attr("font-size","24px")
            .attr("transform", "rotate(-90)")
            .text('# Research articles');
        }
        else{
            svg.append("text")
            .attr("x",  -300)
            .attr("y", -80)
            .attr("text-anchor", "middle")
            .style("fill","black")
            .attr("font-weight", "regular")
            .attr("fill-opacity",0.7)
            .attr("font-size","24px")
            .attr("transform", "rotate(-90)")
            .text('Research trends');
        }

    
        var intervalId = null;
        
        var index = 0; 
        var yaxismaxlimit = 0;  
        //update[index];
     
    
        // update axis through out the loop in interval
        function updateAxis(){
            //update x axis
            svg.selectAll(".x.axis")
            .transition()
                .ease(d3.easeLinear)
                .duration(duration)
                .call(xAxis);
    
    
            // update y axis
            svg.selectAll(".y.axis")
                .transition()
                .ease(d3.easeCubic)
                .duration(duration)
                .call(yAxis);
        }
    
        // update line through out the loop in interval
        function makeLine(data){
    
            // generate line paths
            //console.log(data)
            var lines = svg.selectAll(".line").data(data).attr("class","line");
                
            lines
            .transition()
            .ease(d3.easeLinear)
            .duration(duration)
            .attr("stroke-width", 3.0)
            .attr("stroke-opacity", function(d){
                if(d.value[d.value.length-1].cases>-15){
                    return 1;
                }else{
                    return 0;
                }
            })
            .attr("d",d=> line(d.value))
            .attr("stroke", (d,i) =>  "url(#linear-gradient-"+d.name+")" );
            
    
            // enter any new data
            lines
            .enter()
            .append("path")
            .attr("class","line")
            .attr("fill","none")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("clip-path", "url(#clip)")
            .attr("stroke-width", 4.0)
            .attr("stroke-opacity", function(d){
                if(d.value[d.value.length-1].cases>-15){
                    return 1;
                }else{
                    return 0;
                }
            })
            .transition()
            .ease(d3.easeLinear)
            .duration(duration)
            .attr("d",d=> line(d.value))
            .attr("stroke", (d,i) =>  "url(#linear-gradient-"+d.name+")" );
    
            lines
            .exit()
            .transition()
            .ease(d3.easeLinear)
            .duration(duration)
            .remove();
        }
        
        // update tip circle through out the loop in interval
        function makeTipCircle(data){
            // add circle. generetare new circles
            circles = svg.selectAll(".circle").data(data)
                    
            //transition from previous circles to new
            circles
            .enter()
            .append("circle")
            .attr("class","circle")
            .attr("fill", "white")
            .attr("clip-path", "url(#clip)")
            .attr("stroke", (d,i) =>  "url(#linear-gradient-"+d.name+")" )
            .attr("stroke-width", 2.0)
            .attr("opacity",function(d){
                if(d.value[d.value.length-1].cases>-20){
                    return 1;
                }else{
                    return 0;
                }
            })
            .attr("stroke-opacity", function(d,i){
                if(d.value[d.value.length-1].cases>0){
                    return 1;
                }else{
                    return 0;
                }
            })
            .attr("cx", d=> x(d.value[d.value.length-1].date))
            .attr("cy",function(d){
    
                if (d.value[d.value.length-1].cases > 0){
                    return y(d.value[d.value.length-1].cases); 
                }else{
                    return y(0)
                } 
            })
            .attr("r",17)
            .transition()
            .ease(d3.easeLinear)
            .duration(duration-100)
    
    
    
            //enter new circles
            circles
            .transition()
            .ease(d3.easeLinear)
            .duration(duration-100)
            .attr("cx", d=> x(d.value[d.value.length-1].date))
            .attr("cy",function(d){
                if (d.value[d.value.length-1].cases > 0){
                    return y(d.value[d.value.length-1].cases); 
                }else{
                    return y(0)
                } 
            })
            .attr("r",17)
            .attr("fill", "white")
            .attr("stroke", (d,i) =>  "url(#linear-gradient-"+d.name+")" )
            .attr("stroke-width", 3.0)
            .attr("opacity",function(d){
                if(d.value[d.value.length-1].cases>-20){
                    return 1;
                }else{
                    return 0;
                }
            })
            .attr("stroke-opacity", function(d,i){
                if(d.value[d.value.length-1].cases>-20){
                    return 1;
                }else{
                    return 0;
                }
            })
    
    
            //remove and exit
            circles
            .exit()
            .transition()
            .ease(d3.easeLinear)
            .duration(duration-100)
            .attr("cx", d=> x(d.value[d.value.length-1].date))
            .attr("cy",function(d){  
                if (d.value[d.value.length-1].cases > -20){
                    return y(d.value[d.value.length-1].cases); 
                }else{
                    return y(0)
                } 
            })
            .attr("r",17)
            .remove()
        }
        
        // update lables through out the loop in interval
        function makeLabels(data){
             //generate name labels
             names = svg.selectAll(".lineLable").data(data);
        
             //transition from previous name labels to new name labels
             names
             .enter()
             .append("text")
             .attr("class","lineLable")
             .attr("font-size","21px")
             .attr("clip-path", "url(#clip)")
             .style("fill",(d,i)=>case_types.find(e=>e.id === d.name).color[2])
             .attr("opacity",function(d){
                if(d.value[d.value.length-1].cases>-20){
                    return 1;
                }else{
                    return 0;
                }
             })
             .transition()
             .ease(d3.easeLinear)
             .attr("x",function(d)
             {   
                 return x(d.value[d.value.length-1].date)+30;
             })
             .style('text-anchor', 'start')
             //.text(d => case_types.find(e=>e.id === d.name).title)
             .attr("y",function(d){  
    
                if (d.value[d.value.length-1].cases > -20){
                    return y(d.value[d.value.length-1].cases) - 5;
                }else{
                    return y(0)
                }
             })
             
     
             // add new name labels
             names
             .transition()
             .ease(d3.easeLinear)
             .duration(duration)
             .attr("x",function(d)
             {   
                 return x(d.value[d.value.length-1].date)+30;
             })
             .attr("y",function(d){
                 
                if (d.value[d.value.length-1].cases > 0){
                    return y(d.value[d.value.length-1].cases) - 5;
                }else{
                    return y(0) + 0
                }
                 
             })
             .attr("opacity",function(d){
                if(d.value[d.value.length-1].cases>-20){
                    return 1;
                }else{
                    return 0;
                }
             })
             .attr("font-size","21px")
             .style("fill",(d,i)=>case_types.find(e=>e.id === d.name).color[2])
             .style('text-anchor', 'start')
             //.text(d => case_types.find(e=>e.id === d.name).title)
     
             
             // exit name labels
             names.exit()
             .transition()
             .ease(d3.easeLinear)
             .duration(duration)
             .style('text-anchor', 'start')
             .remove();
     
     
     
             //generate labels
             labels = svg.selectAll(".label").data(data);
     
             //transition from previous labels to new labels
             labels
             .enter()
             .append("text")
             .attr("class","label")
             .attr("font-size","18px")
             .attr("clip-path", "url(#clip)")
             .style("fill",(d,i)=>case_types.find(e=>e.id === d.name).color[2])
             .attr("opacity",function(d){
                if(d.value[d.value.length-1].cases>-20){
                    return 1;
                }else{
                    return 0;
                }
             })
             .transition()
             .ease(d3.easeLinear)
             .attr("x",function(d)
             {   
                 return x(d.value[d.value.length-1].date)+30;
             })
             .style('text-anchor', 'start')
             .text(d => d3.format(',.0f')(d.value[d.value.length-1].cases))
             .attr("y",function(d){
    
                if (d.value[d.value.length-1].cases > 0){
                    return y(d.value[d.value.length-1].cases)+15;
                }else{
                    return y(0)-5
                }             
             })
             
     
             // add new labels
             labels
             .transition()
             .ease(d3.easeLinear)
             .duration(duration)
             .attr("x",function(d)
             {   
                 return x(d.value[d.value.length-1].date)+30;
             })
             .attr("y",function(d){
                
            if (d.value[d.value.length-1].cases > 0){
                    return y(d.value[d.value.length-1].cases)+15;
                }else{
                    return y(0)-5
                } 
    
             })
             .attr("opacity",function(d){
                if(d.value[d.value.length-1].cases>-20){
                    return 1;
                }else{
                    return 0;
                }
             })
             .attr("font-size","25px")
             .style("fill",(d,i)=>case_types.find(e=>e.id === d.name).color[2])
             .style('text-anchor', 'start')
             //.text(d => d3.format(',.0f')(d.value[d.value.length-1].cases))
             .tween("text", function(d) {
                 if (d.value[d.value.length-1].cases !== 0) {
                    let i = d3.interpolateRound(d.value[d.value.length-2].cases, d.value[d.value.length-1].cases);
                    return function(t) {
                        this.textContent = d3.format(',')(i(t));
                     };
                 }
                
              });
     
             
             // exit labels
             labels.exit()
             .transition()
             .ease(d3.easeCubic)
             .duration(duration)
             .style('text-anchor', 'start')
             .remove();
             
        }
        
        // function to update the line in each frame
        function update(){
            
            if (index < final.length){
                //data = final[index]
                 if(index===0){
                 data = final[index]
                 j=4
                 }
                 else{
                    j = j+1
                    data["0"].value[j] = final[index]["0"]["value"][Object.keys(final[index]["0"]["value"]).length -1]
                    data["1"].value[j] = final[index]["1"]["value"][Object.keys(final[index]["1"]["value"]).length -1] 
                 }
            
                date_start = new Date(yearStart)
                date_end = new Date(yearStop)
    
                //console.log("dates: ",date_start,date_end);
                x.domain([date_start, date_end]);      
                
                // Create the Y axis:
                max_cases_value_of_each_country = data.map(o => Math.max(...o.value.map(v=>v.cases)))
                
                var maxOfValue = Math.max(...max_cases_value_of_each_country.map(o => o));
    
                if (maxOfValue < 10){
                    maxOfValue = 10
                }
    
                if (maxOfValue > yaxismaxlimit){
                    yaxismaxlimit = maxOfValue;
                }
    
                y.domain([-0.3, maxOfValue]).nice();
    
                updateAxis(x,y);
                makeLine(data)          
                makeTipCircle(data)
                
                makeLabels(data)
    
                var month = monthFormat(data[0].value[data[0].value.length-1].date)
                
                monthTxt
                .transition()
                .ease(d3.easeCubic)
                .duration(duration)
                .attr("fill-opacity",0.7)
                .text(month);
                
                stopButton.addEventListener('click', function() {
                    clearInterval(intervalId);
                });
        
                index = index + 1;
    
            }else{
                // clear inetrval at the end
                clearInterval(intervalId);
            }
           
    
    
        }
        // start the interval method 
        var intervalId = setInterval(update,duration);
       
       
    });

    

return true;
};


playButton.addEventListener('click', function() {
    disableButtons();
    enableStopButton()
    d3.select("svg").remove();
    document.getElementById("gif").style.display = 'block'
    document.getElementById("divsvg").style.display = 'none'
    typeSelect = document.getElementById("myInput").name
    typeSelect2 = document.getElementById("myInput2").name
    name1=document.getElementById("myInput").value
    name2 = document.getElementById("myInput2").value
    const perYearCheck = document.getElementById("perYear");
    total = perYearCheck.checked
    console.log(typeSelect)
    console.log(typeSelect2)
    line2(typeSelect, typeSelect2, speedSlider.value, startYearSlider.value, endYearSlider.value,name1,name2,total);

});
stopButton.addEventListener('click', function() {
    disableButtons();
    enablePlayButton()
});