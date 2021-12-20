function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var bbsamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var bbsampleResults = bbsamples.filter(sampleObj=> sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var bbsampleResult = bbsampleResults[0];
  
  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
  var bbmetadata = data.metadata;
  console.log(bbmetadata)
  var bbmetadataResults = bbmetadata.filter(metaObj=> metaObj.id == sample);
  console.log(bbmetadataResults)
  // 2. Create a variable that holds the first sample in the metadata array.
  var bbmetadataResult = bbmetadataResults[0]
  console.log(bbmetadataResult)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = bbsampleResult.otu_ids;
    var otuValue = bbsampleResult.sample_values.slice(0,10).reverse();
    var otuLabel = bbsampleResult.otu_labels.slice(0,10).reverse();
        
    // 3. Create a variable that holds the washing frequency.
    var otuWfreq = parseFloat(bbmetadataResult.wfreq);
    console.log(otuWfreq)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuId.map(sampleObj => "OTU" + sampleObj + " ").slice(0,10).reverse()

    // 8. Create the trace for the bar chart. 
    var traceBar = {
      x: otuValue,
      y: yticks,
      type: "bar",
      orientation: 'h',
      text: otuLabel
    };
    
    // 9. Create the layout for the bar chart. 
    var layoutBar = {
      title: "Top 10 Bacteria Cultures Found"
     
  };
    // var barLayout = {
     
    // };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [traceBar], layoutBar);
    
    // 1. Create the trace for the bubble chart.
    var traceBubble = [{
      x: otuId, 
      y: otuValue,
      mode: 'markers',
      marker: {size: otuValue,
      color: otuId, //colorscale: 'Turbid'
      colorscale: 'Electric'
    },
      text: otuLabel
      
    }]

    // 2. Create the layout for the bubble chart.
    var layoutBubble = {
      title: 'Bateria Cultures Per Sample',
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      }
    };
   
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", traceBubble, layoutBubble); 

    // 4. Create the trace for the gauge chart.
    var traceGauge = [
      {
        
        value: otuWfreq,
        mode: "gauge+number",
        type: "indicator",
        title: { text: "Scrubs per Week" },
        gauge: {
          axis:{ range: [null, 10], dtick: 2 },
          bar: {color: "black"},
        steps: [{range: [0,2], color: "red" }, 
        {range: [2,4], color: "orange" },
        {range: [4,6], color: "yellow" },
        {range: [6,8], color: "green" },
        {range: [8,10], color: "darkgreen" }],
        // domain: { x: [0, 1], y: [0, 1] },
        
              
      }}
        ];
        
    // 5. Create the layout for the gauge chart.
    var layoutGauge = { 
      title: { text:'Belly Button Washing Frequency',},
      // plot_bgcolor: "#e4e6e7",
      // paper_bgcolor: "#e4e6e7",
      font: {
        family: "Goudy Old Style Bold",
      },
      automargin: true,
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", traceGauge, layoutGauge);
  });
  
}
