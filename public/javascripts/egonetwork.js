$(document).ready(function () {
    $("button#userrun").click(function (event) {
        var name = $('input#userinput').val()
        gengraph(name);
        event.preventDefault();
    });
});

function gengraph(name) {

    $('input#userinput').val(name);

    var path = {
        "user_id": name,
        "json_path": "friendinterest_split_0/",
    }

    d3.selectAll("#egonetwork").remove();

    egograph(path);

    var body = d3.select("body")
        body.selectAll("#info_card").classed("d-none", true);
        body.selectAll("#group_card").classed("d-none", false);
        body.selectAll("#group_form").classed("d-none", false);
        body.selectAll("#scale_form").classed("d-none", false);

}

function egograph(path) {
    url_path = "egonetwork/data/" + path.json_path + path.user_id;
    d3.json(url_path).then(function (data) {

        graph = data

        function color_node(d) {
            var index_cat = graph.category.indexOf(d.group) / graph.category.length;
            color_plate = d3.interpolateRainbow(index_cat);
            return color_plate;
        }

        function color_link(d) {
            var index_cat = graph.category.indexOf(d.group) / graph.category.length;
            color_plate = d3.interpolateRainbow(index_cat);
            return color_plate;
        }

        function zoomed() {
            container.attr("transform", "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ") scale(" + d3.event.transform.k + ")");
        }

        var zoom = d3.zoom()
            .scaleExtent([0, 50])
            .on("zoom", zoomed);

        var width = $('.egograph').width(),
            height = $('.wrapper').height();

        var svg = d3.select("body").selectAll(".egograph")
            .append("svg")
            .attr("id", "egonetwork")
            .attr("width", width)
            .attr("height", height)
            .attr("preserveAspectRatio", "xMaxYMin meet")
            .style("pointer-events", "all")
            .call(zoom)
            .on("wheel", function () { d3.event.preventDefault(); });

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(10).strength(1))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide(15).strength(5));

        var container = svg.append("g")
            .attr("class", "main_plate")

        var link = container.selectAll("line").data(graph.links)
            .enter().append("line")
            .attr("class", "link")
            .attr("group", function(d) { return d.group })
            .style("stroke-width", 1).style("stroke-opacity", 0.5)
            .style("stroke", function (d) { return color_link(d); })
            .style("cursor", "default");

        var node = container.selectAll("circle").data(graph.nodes)
            .enter().append("circle")
            .attr("group", function (d) { return d.group; })
            .attr("name", function (d) { return d.name; })
            .attr("r", function (d) {
                if (d.group === "Main") return "10";
                else return "6";
            })
            .style("opacity", 1).style("stroke-width", 0).style("stroke", "red")
            .attr("fill", function (d) { return color_node(d); })
            .on("click", function (d) {
                mouseout_node();
                mouseover_node(d);
                d3.select("#info_show").html(getInfo(d));
            });

        var label = container.selectAll("text").data(graph.nodes)
            .enter().append("text")
            .attr("class", "node_label")
            .attr("font-size", 2)
            .style("fill-opacity", 0.2)
            .style("fill", "#213451")
            .text(function (d) { return d.name; });

        simulation.force("link", d3.forceLink().id(function (d) { return d.name; }))
            .on("tick", ticked)
            .nodes(graph.nodes)
            .force("link").links(graph.links);

        function ticked() {
            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });

            label.attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; });

            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        }

        function mouseover_node(z) {
            var neighbors = {};
            neighbors[z.index] = true;

            link.filter(function (d) {
                if (d.source == z) {
                    neighbors[d.target.index] = true
                    return true
                } else if (d.target == z) {
                    neighbors[d.source.index] = true
                    return true
                } else {
                    return false
                }
            })
                .style("stroke-opacity", 1)
                .style("stroke-width", 2)

            node.filter(function (d) { return neighbors[d.index] })
                .style("stroke-width", 2)
                .style("opacity", 1);

            node.filter(function (d) { return !neighbors[d.index] })
                .style("stroke-width", 0)
                .style("opacity", 0.3);

            label.filter(function (d) { return !neighbors[d.index] })
                .attr("font-size", 1)
                .style("fill-opacity", 0.2);

            label.filter(function (d) { return neighbors[d.index] })
                .attr("font-size", 3)
                .style("fill-opacity", 1);

        };

        function mouseout_node() {
            link.style("stroke-opacity", 1)
                .style("stroke-width", 0.5)

            node.style("stroke-width", 0)
                .style("opacity", 1);

            label.attr("font-size", 2)
                .style("fill-opacity", 0.2)
        };

        d3.select("#group_show").html(getDetail(graph.category));
        d3.select("#clear_input").on("click", function (d) {
            mouseout_node();
        });

        function getDetail(n) {
            d3.select("#group_show").style('display', 'grid');
            var info = '<p style="margin-bottom: 0.5em;">   Category </p>';
            n.forEach(function (value, index) {
                info += ' <a href="#" onclick="groupover_node(\'' + value + '\');"><span>' + (index + 1) + '.' + value
                info += ' </span><div style="display: inline-block; height: 10px; width: 10px; background-color: ' + d3.interpolateRainbow(index/n.length) + ';">'
                info += '</div></a>'

            });
            return info;
        }

        function getInfo(n) {

            d3.select("body").selectAll("#info_card").classed("d-none", false);

            var info = "<p style=\"text-align:center; font-size: 1.5em;\">" + '<a href="#" onclick="gengraph(\'' + n.name + '\');">' + n.name + "</a></p>";
            info += '<hr><p style="font-weight: bold;"> Category </p>';

            var i = 1;
            for (var cat in n.category) {
                info += '<p>' + i + '.' + cat + " : " + n.category[cat] + '</p>';
                i += 1;
            }
            return info;
        }
    });
}

function groupover_node(z) {
    var nodes = d3.select("#egonetwork").selectAll("circle");
        links = d3.select("#egonetwork").selectAll("line");
        labels = d3.select("#egonetwork").selectAll("text");

    links.style("stroke-opacity", 1)
        .style("stroke-width", 0.5)

    nodes.style("stroke-width", 0)
        .style("opacity", 1);

    labels.attr("font-size", 2)
        .style("fill-opacity", 0.2)

    var neighbors = {};

    links.filter(function (d) {
        if (d.group == z) {
            neighbors[d.source.id] = true
            neighbors[d.target.id] = true
            return true
        } else {
            return false
        }
    })
        .style("stroke-opacity", 1)
        .style("stroke-width", 2)

    nodes.filter(function (d) {
        if (d.group == "Main") {
            return true
        } else {
            return neighbors[d.id]
        }
    })
        .style("stroke-width", 2)
        .style("opacity", 1);

    labels.filter(function (d) {
        if (d.group == "Main") {
            return true
        } else {
            return neighbors[d.id]
        }
    })
        .attr("font-size", 3)
        .style("fill-opacity", 1);
}