
export function getCurrentIteration(solution_list:Solution[], it_number: number){
    const list_result: Solution[]= []
    for (let i = 0; i < solution_list.length; i++) {
        if (solution_list[i].iteration == it_number){
            const new_solution = solution_list[i];
            new_solution.impact = getImpactLevels(new_solution);
            const tradeoffs:string[][] = []
            for (let index = 0; index < new_solution.objective_values.length; index++) {
                const tradeoff_index:string[] = improveObjectiveIth(new_solution, index);
                tradeoffs.push(tradeoff_index);
            }
            new_solution.tradeoff_matrix = tradeoffs;
            list_result.push(new_solution);
            console.log(new_solution);
        }
    }

    return list_result;
};

export function getIthObjectiveValues(solution_list:Solution[], obj_number: number){
    const list_result: number[]= []
    for (let i = 0; i < solution_list.length; i++) {   
        list_result.push(solution_list[i].objective_values[obj_number]);
    }
    return list_result;
};

export function getImpactLevels(solution: Solution){
    const options = ["Low","Medium","High"];
    const result = [];
    for (let index = 0; index < solution.objective_values.length; index++) {
        const random = Math.floor(Math.random() * options.length);
        result.push(options[random]);
    }
    return result;
}

export function improveObjectiveIth(solution: Solution, objective_to_improve: number){
    const options = ["Impair", "Neutral"];
    const result = [];
    for (let index = 0; index < solution.objective_values.length; index++) {
        if (index == objective_to_improve){
            result.push("Improve");
        }
        else{
            const random = Math.floor(Math.random() * options.length);
            result.push(options[random]);
        }
    }
    return result;
}

