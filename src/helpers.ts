
export function getCurrentIteration(solution_list:Solution[], it_number: number){
    const list_result: Solution[]= []
    for (let i = 0; i < solution_list.length; i++) {
        if (solution_list[i].iteration == it_number){
            list_result.push(solution_list[i]);
        }
    }
    return list_result;
};