export const RPP_Info = {
    objective_long_names: ["Dissolved oxygen concentration in the city", "Dissolved oxygen concentration at the municipality border ", "Percent return on investment at the fishery", "Addition to the city tax ", "(BOD) removed from the water close to the ideal value"],
    objective_short_names: ["WQFish", "WQCity", "ROI", "CityTax", "Plant"],
    is_maximized: [true, true, true, true, true],
    lower_bounds: [5.23, 2.90, 0.32, -0.9, 0.013],
    upper_bounds: [6.34, 3.41, 7.35, -0.0029, 0.35],
    variable_names: ["BOD","DO"]
};

const Solution1 = {
    iteration: 0,
    index: 0,
    objective_values: [5.766, 2.919, 6.874, -0.246, 0.107],
    decision_variables:[0.9,0.3],
    reference_point: [6.34, 3.41, 7.3, -0.0029, 0.014]

}
const Solution2 = {
    iteration: 0,
    index: 1,
    objective_values: [5.882,3.010, 6.640, -0.825, 0.148],
    decision_variables:[0.7,0.1],
    reference_point: [6.34, 3.41, 7.3, -0.0029, 0.014]

}
const Solution3 = {
    iteration: 0,
    index: 2,
    objective_values: [6.006, 2.905, 6.249, -0.140, 0.203],
    decision_variables:[1.3,1.1],
    reference_point: [6.34, 3.41, 7.3, -0.0029, 0.014]

}
const Solution4 = {
    iteration: 0,
    index: 3,
    objective_values: [6.163, 2.960, 5.243, -0.422, 0.2772],
    decision_variables:[2.1,1.2],
    reference_point: [6.34, 3.41, 7.3, -0.0029, 0.014]

}
const Solution5 = {
    iteration: 1,
    index: 4,
    objective_values: [5.285 , 2.896 , 7.325 , -0.174 , 0.156 ],
    decision_variables:[1.5, 0.4],
    reference_point: [5.9, 2.94, 5.72, -0.4, 0.2]

}
const Solution6 = {
    iteration: 1,
    index:5,
    objective_values: [5.688 , 3.016 , 6.989 , -0.907 , 0.108],
    decision_variables:[0,1.2],
    reference_point: [5.9, 2.94, 5.72, -0.4, 0.2]

}
const Solution7 = {
    iteration: 1,
    index:6,
    objective_values: [5.788 , 2.900 , 6.835 , -0.141 , 0.182],
    decision_variables:[2,1.5],
    reference_point: [5.9, 2.94, 5.72, -0.4, 0.2]

}
const Solution8 = {
    iteration: 1,
    index:7,
    objective_values: [5.826 , 2.989 , 6.765 , -0.682 , 0.123],
    decision_variables:[0.1,0.5],
    reference_point: [5.9, 2.94, 5.72, -0.4, 0.2]

}
const Solution9 = {
    iteration: 2,
    index:8,
    objective_values: [5.403, 2.868, 7.256, -0.021, 0.315],
    decision_variables:[1,0.1],
    reference_point: [5.826, 2.989, 6.765, -0.682, 0.123]

}
const Solution10 = {
    iteration: 2,
    index:9,
    objective_values: [5.767, 2.903, 6.872, -0.162, 0.165],
    decision_variables:[0.5,1.75],
    reference_point: [5.826, 2.989, 6.765, -0.682, 0.123]

}
const Solution11 = {
    iteration: 2,
    index:10,
    objective_values: [5.704, 2.984, 6.968, -0.669, 0.069],
    decision_variables:[2,1.43],
    reference_point: [5.826, 2.989, 6.765, -0.682, 0.123]

}
const Solution12 = {
    iteration: 2,
    index:11,
    objective_values: [5.827, 2.882, 6.761, -0.048, 0.278],
    decision_variables:[1.9,1.7],
    reference_point: [5.826, 2.989, 6.765, -0.682, 0.123]
}


export const solution_process = [Solution1, Solution2, Solution3, Solution4, Solution5, Solution6, Solution7, Solution8, Solution9, Solution10, Solution11, Solution12]
