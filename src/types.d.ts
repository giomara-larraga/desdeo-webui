type SolutionData = {
  names: string[];
  values: number[][];
  value_ranges: number[][];
  tags: string[][];
  uncertainty: number[][][];
  minimize: boolean[];
};

type Solution = {
  iteration: number;
  index: number;
  objective_values: number[];
  decision_variables: number[];
  reference_point: number[];
  impact: number[];
  tradeoff_matrix: number[][];
};

type problemInfoType = {
  objective_long_names: string[];
  objective_short_names: string[];
  variable_names: string[];
  is_maximized: boolean[];
  lower_bounds: number[];
  upper_bounds: number[];
};

type Ranges = {
  min: number | undefined;
  max: number | undefined;
};
