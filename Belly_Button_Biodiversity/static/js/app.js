function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(d){
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(d).forEach(([key,value]) => {
      panel.append("h5").text(`${key}: ${value}`);
    });
  });


}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((d) => {
    // @TODO: Build a Bubble Chart using the sample data
      
    var bubble_trace = {
      x: d.otu_ids,
      y: d.sample_values,
      marker: {
        size: d.sample_values,
        color: d.otu_ids
      },
      text: d.otu_labels,
      mode: 'markers'
    };

    var bubble_data = [bubble_trace];

    var bubble_layout = {
      xaxis: {title:'OTU ID'}
    };

    Plotly.newPlot('bubble', bubble_data, bubble_layout);

    // @TODO: Build a Pie Chart
    var pie_trace = {
      labels: d.otu_ids.slice(0,10),
      values: d.sample_values.slice(0,10),
      hoverinfo: d.otu_labels.slice(0,10),
      type: 'pie'
    };

    var pie_data = [pie_trace];

    var pie_layout = {
      title: "Top 10 Samples"
    };

    Plotly.newPlot("pie", pie_data, pie_layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();