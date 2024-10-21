import * as fs from 'fs';
import * as path from 'path';
import { split } from 'postcss/lib/list';
import { map } from 'zod';
import { error } from '@sveltejs/kit';
import { text } from 'd3';


export const RPP_Info = {
    objective_long_names: ["Dissolved oxygen concentration in the city", "Dissolved oxygen concentration at the munpath.icipality border ", "Percent return on investment at the fishery", "Addition to the city tax "],
    objective_short_names: ["WQFish", "WQCity", "ROI", "CityTax"],
    is_maximized: [true, true, true, true],
    lower_bounds: [3.40, 2.7, 0.30, -9.5],
    upper_bounds: [6.74, 3.45, 7.5, 0],
    variable_names: ["BOD","DO"]
};

// Fetch and parse CSV from public directory
  async function fetchCSV(filename:string, iteration:number, reference_point:number[]) {
    let result: Solution[]  = [];
    const response = await fetch('/'+filename);
    if (response.ok) {
      const csvText = await response.text();
      const lines = csvText.split('\n');
      result = lines.map((line, index) => {
      const values = line.split(' ');
        return {
            index: index,
            iteration: iteration,
            reference_point: reference_point,
            decision_variables: [Number(values[0]),Number(values[1])],
            objective_values: [Number(values[2]), Number(values[3]), Number(values[4]), Number(values[5])],
            impact: [Number(values[6]), Number(values[7]), Number(values[8]), Number(values[9])],
            tradeoff_matrix: [[Number(values[10]), Number(values[11]), Number(values[12]), Number(values[13])], [Number(values[14]), Number(values[15]), Number(values[16]), Number(values[17])],[Number(values[18]), Number(values[19]), Number(values[20]), Number(values[21])], [Number(values[22]), Number(values[23]), Number(values[24]), Number(values[25])]],
        };
        });
      
    } else {
      console.error('Failed to load CSV file');
    }
    return result;
  }

function read_data(filename:string, iteration:number, reference_point:number[]){
    const csvFilePath = path.resolve(__dirname, filename);
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    const lines = fileContent.split('\n');
    const result: Solution[] = lines.map((line, index) => {
    const values = line.split(' ');
    const num_solutions = 5;
    return {
        index: (num_solutions * iteration)+index,
        iteration: iteration,
        reference_point: reference_point,
        decision_variables: [Number(values[0]),Number(values[1])],
        objective_values: [Number(values[2]), Number(values[3]), Number(values[4]), Number(values[5])],
        impact: [Number(values[6]), Number(values[7]), Number(values[8]), Number(values[9])],
        tradeoff_matrix: [[Number(values[10]), Number(values[11]), Number(values[12]), Number(values[13])], [Number(values[14]), Number(values[15]), Number(values[16]), Number(values[17])],[Number(values[18]), Number(values[19]), Number(values[20]), Number(values[21])], [Number(values[22]), Number(values[23]), Number(values[24]), Number(values[25])]],
    };
    });

    return result;
}

export async function get_solutions(){
    let reference_points = [[  6.34, 3.44487179, 7.14, -3.2],[6.399807085523101, 3.2426842786065544, 5.597210855618293, -6.014067379564384],[5.7597554210153, 2.8720415929145733, 6.8867202610884535, -4.026246378519005e-07]];
    let files = ["it1.csv", "it2.csv", "it3.csv"];
    let solutions: Solution[][] = []
    for (let index = 0; index < files.length; index++) {
        const solutions_it = fetchCSV(files[index], index, reference_points[index]);
        solutions.push(await solutions_it);
    }
    return solutions;
}