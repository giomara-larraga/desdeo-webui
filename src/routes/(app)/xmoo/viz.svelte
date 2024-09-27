<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { colorPalette, selectedLineStyle } from "$lib/components/visual/constants";
    import { scale } from "svelte/transition";

    export let solutions: Solution[] = [];
    export let lowerIsBetter: boolean[] = [];
    export let showIndicators = false;
    export let ranges: Ranges[] | undefined = undefined;
    export let names: string[] = [];
    export let selectedIndices: (number | null)[] = [];  // Allow null values
    export let referencePoint: number[] = [];

    let svg: SVGSVGElement;

    function drawPlot() {
        if (!ranges || names.length === 0 || solutions.length === 0) return;

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 30, bottom: 20, left: 30 };
        const barWidth = (width - margin.left - margin.right) / names.length;
        const ticknessBar = 20;
        const positionMarker = ticknessBar / 2;
        const legendPositionX =  barWidth * (names.length - 1) + ticknessBar + 30
        const legendPositionY = 0
        // Clear existing plot
        d3.select(svg).selectAll("*").remove();

        const svgElement = d3
            .select(svg)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // Define the arrow marker
        svgElement
            .append("defs")
            .append("marker")
            .attr("id", "arrow-positive")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 6) // Position of the arrow tip
            .attr("refY", 5)
            .attr("markerWidth", 4)
            .attr("markerHeight", 4)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 Z") // Arrow shape
            .attr("fill", "green"); // Arrow color

        svgElement
            .append("defs")
            .append("marker")
            .attr("id", "arrow-negative")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 6) // Position of the arrow tip
            .attr("refY", 5)
            .attr("markerWidth", 4)
            .attr("markerHeight", 4)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 Z") // Arrow shape
            .attr("fill", "red"); // Arrow color


            // Create scales for each axis
        const scales = names.map((_, i) =>
            d3.scaleLinear()
                .domain([ranges[i].min, ranges[i].max])
                .range([height - margin.top - margin.bottom, 0])
        );

        // Add y-axes and bars
        scales.forEach((scale, i) => {
            svgElement
                .append("g")
                .attr("transform", `translate(${i * barWidth}, 0)`)
                .call(d3.axisLeft(scale).ticks(5));

            // Draw vertical bar for each axis
            svgElement
                .append("rect")
                .attr("x", i * barWidth)
                .attr("width", ticknessBar)
                .attr("height", height - margin.top - margin.bottom)
                .attr("y", 0)
                .attr("fill", "#ddd");
                //.attr("stroke-width", 5)
                //.attr("stroke", colorPalette[i]);

            //Draw color bar for the selected solution
                      
           
            
        });

        if (selectedIndices[0] !=null){
            solutions[selectedIndices[0]].objective_values.forEach((value, i) => {
                svgElement
                    .append("rect")
                    .attr("x", i * barWidth)
                    .attr("width", ticknessBar)
                    .attr("height", (height - margin.top - margin.bottom) - scales[i](value))
                    .attr("y", function(d) { return scales[i](value); })
                    .attr("fill", colorPalette[i]);

                    /*svgElement
                    .append("rect")
                    .attr("x", i * barWidth)
                    .attr("width", ticknessBar)
                    .attr("height", Math.abs(scales[i](referencePoint[i]) - scales[i](value)))
                    .attr("y", value < referencePoint[i]?scales[i](referencePoint[i]):scales[i](value))
                    .attr("fill", value < referencePoint[i]?"red":"green")*/
     
            })
        }

        // Plot solutions' objective values as markers and lines
        solutions.forEach((solution, solutionIndex) => {
            const line = d3
                .line<number>()
                .x((_, i) => i * barWidth + positionMarker)
                .y((_, i) => scales[i](solution.objective_values[i]));

            svgElement
                .append("path")
                .datum(solution.objective_values)
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", selectedIndices[0] === solutionIndex ? "blue" : selectedIndices[0]===null?"blue":"#C5E3E6")
                .attr("stroke-width", selectedIndices[0] === solutionIndex ? 2 : 1)
                .attr("class", "solution-line");

            // Add an invisible larger "click area" path over the line
            svgElement
                .append("path")
                .datum(solution.objective_values)
                .attr("d", line)
                .attr("fill", "none")
                .attr("stroke", "transparent") // Make the stroke invisible
                .attr("stroke-width", 10) // Increase stroke width to make it easier to click
                .attr("class", "clickable-line")
                .on("click", () => selectLine(solutionIndex)); // Handle the click event

            // Plot circular markers
            solution.objective_values.forEach((value, i) => {
                svgElement
                    .append("circle")
                    .attr("cx", i * barWidth + positionMarker)
                    .attr("cy", scales[i](value))
                    .attr("r", 4)
                    .attr("fill", selectedIndices[0] === solutionIndex ? "blue" : selectedIndices[0]===null?"blue":"#C5E3E6")
                    .attr("class", "solution-marker")
                    .on("click", () => selectLine(solutionIndex));
            });
        });


        // Plot reference point markers and lines
        const refLine = d3
            .line<number>()
            .x((_, i) => i * barWidth + positionMarker)
            .y((_, i) => scales[i](referencePoint[i]));

        svgElement
            .append("path")
            .datum(referencePoint)
            .attr("d", refLine)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        referencePoint.forEach((value, i) => {
            svgElement
                .append("circle")
                .attr("cx", i * barWidth + positionMarker)
                .attr("cy", scales[i](value))
                .attr("r", 5)
                .attr("fill", "red");
        });

        /*svgElement.append("circle").attr("cx", legendPositionX).attr("cy",0).attr("r", 6).style("fill", "green")
        svgElement.append("circle").attr("cx",legendPositionX).attr("cy",30).attr("r", 6).style("fill", "#C00000")
        svgElement.append("text").attr("x", legendPositionX + 10).attr("y", 0).text("Positive difference").style("font-size", "12px").attr("alignment-baseline","middle")
        svgElement.append("text").attr("x", legendPositionX + 10).attr("y", 30).text("Negative difference").style("font-size", "12px").attr("alignment-baseline","middle")
*/
        // If a line is selected, draw dashed line connecting to reference point
        if (selectedIndices[0] !== null) {
            const selectedSolution = solutions[selectedIndices[0]];

            selectedSolution.objective_values.forEach((value, i) => {
                svgElement
                    .append("line")
                    .attr("x1", i * barWidth + positionMarker)
                    .attr("y1", scales[i](referencePoint[i]))
                    .attr("x2", i * barWidth + positionMarker)
                    .attr("y2", value < referencePoint[i]?scales[i](value)-10:scales[i](value)+10)
                    .attr("stroke", value < referencePoint[i]? "red":"green")
                    .attr("stroke-width", 2.5)
                    .attr("stroke-dasharray", "6,2")
                    .attr("marker-end", value < referencePoint[i]?"url(#arrow-negative)":"url(#arrow-positive)"); // Attach arrow marker at the end;

                /*svgElement
                    .append("rect")
                    .attr("x", i * barWidth)
                    .attr("width", ticknessBar)
                    .attr("height", Math.abs(scales[i](referencePoint[i]) - scales[i](value)))
                    .attr("y", value < referencePoint[i]?scales[i](referencePoint[i]):scales[i](value))
                    .attr("fill", value < referencePoint[i]?"red":"green");*/
            });
        }
    }

    // Line selection function
    function selectLine(index: number) {
        // Set selected index and force reactivity by reassigning the array
        selectedIndices = [index === selectedIndices[0] ? null : index];  // Toggle selection
        drawPlot();
    }

    // Redraw plot if input data or selection changes
    $: drawPlot();  // Reactive statement to redraw plot when `selectedIndices` changes

    onMount(() => {
        drawPlot();  // Initial plot drawing
    });
</script>

<svg bind:this={svg}></svg>

<style>
    .solution-marker {
        cursor: pointer;
    }
    .solution-line {
        cursor: pointer;
    }
</style>
