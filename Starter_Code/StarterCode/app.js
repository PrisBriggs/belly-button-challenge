function init() {
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
        console.log(data);
        var names = data.names;
        for (let i = 0; i < names.length; i++) {
            selector.append("option").text(names[i]).property("value", names[i]);
        };
        var FirstName = names[0];
        buildgraphs(FirstName);
        buildtable(FirstName);
    });
}
function optionChanged(newsample) {
    buildgraphs(newsample);
    buildtable(newsample);
}
init();

function buildtable(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var metaarray = metadata.filter(obj => obj.id == sample);
        var metaresult = metaarray[0];
        var table = d3.select("#sample-metadata");
        table.html("");
        for (key in metaresult) {
            table.append("h6").text(`${key.toUpperCase()}: ${metaresult[key]}`);
        };

    });

}

function buildgraphs(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var metaarray = metadata.filter(obj => obj.id == sample);
        var metaresult = metaarray[0];
        var washfrequency = metaresult.wfreq;

        var samples = data.samples;
        var samplesarray = samples.filter(obj => obj.id == sample);
        var samplesresult = samplesarray[0];
        var otu_ids = samplesresult.otu_ids;
        var otu_labels = samplesresult.otu_labels;
        var sample_values = samplesresult.sample_values;
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();


        var barData = [{
            type: 'bar',
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            orientation: 'h'
        }];

        Plotly.newPlot('bar',barData);

        var trace1 = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Blues",
            }
          };
          
          var bubbledata = [trace1];
          
          var bubblelayout = {
            title: 'OTU IDs vs Number of Samples',
            showlegend: false,
            height: 600,
            width: 1200
            
          };
          
          Plotly.newPlot('bubble', bubbledata, bubblelayout);
          
          var gaugedata = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: washfrequency,
              title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
              // subtitle: { text: "Scrubs per week", font: { size: 16 } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                  { range: [0, 1], color: "#f7fbff" },
                  { range: [1, 2], color: "#ddeaf6" },
                  { range: [2, 3], color: "#bfd9ec" },
                  { range: [3, 4], color: "#93c3df" },
                  { range: [4, 5], color: "#61a7d1" },
                  { range: [5, 6], color: "#2676b6" },
                  { range: [6, 7], color: "#135ea5" },
                  { range: [7, 8], color: "#094285" },
                  { range: [8, 9], color: "#f3f8fe9" }
                ],
              }
            }
          ];
          
          var gaugelayout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white",
            font: { color: "darkblue", family: "Arial" }
          };
          
          Plotly.newPlot('gauge', gaugedata, gaugelayout);
          
    })
};
