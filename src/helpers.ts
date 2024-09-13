
export function getCurrentIteration(solution_list:Solution[], it_number: number){
    const list_result: Solution[]= []
    for (let i = 0; i < solution_list.length; i++) {
        if (solution_list[i].iteration == it_number){
            list_result.push(solution_list[i]);
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