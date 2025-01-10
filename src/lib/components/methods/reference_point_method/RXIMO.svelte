<!--
@component
A user interface for the NIMBUS method.
-->
<script lang="ts">
  //
  // TODO: Fix the way maximization/minimization is presented in the NIMBUS visualization
  //
  // TODO: Improve error handling. Currently we show very general error
  // messages.
  //

  import {
    ListBox,
    ListBoxItem,
    modalStore,
    popup,
    type ModalSettings,
  } from "@skeletonlabs/skeleton";

  import type { Token } from "$lib/api";
  import { toastStore } from "@skeletonlabs/skeleton";

  import Visualizations from "$lib/components/util/undecorated/Visualizations.svelte";
  import Card from "$lib/components/main/Card.svelte";
  import GeneralError from "$lib/components/util/undecorated/GeneralError.svelte";
  import Table from "$lib/components/util/undecorated/Table.svelte";
  import ParallelCoordinatePlotBase from "$lib/components/visual/visualization/props-linking/ParallelCoordinatePlot.svelte";
  import { transform_bounds } from "$lib/components/util/util";

  import ClassificationPreference from "$lib/components/visual/preference-interaction/XClassificationPreference.svelte";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import Input from "$lib/components/visual/preference-interaction/BasicInput.svelte";
  import { onMount } from "svelte";
  import EchartsComponent from "$lib/components/visual/general/EchartsComponent.svelte";
  import NimbusLayout from "$lib/components/util/undecorated/NIMBUSLayout.svelte";
  import { roundToDecimal } from "$lib/components/visual/helperFunctions";
  import RpmLayout from "./RPMLayout.svelte";

  /** The problem to solve. */
  export let problem_id: number;
  // Link to the backend.
  export let API_URL: string;
  // The authentication token.
  export let AUTH_TOKEN: Token;
  // Flag to visualize the decision space. Useful for UTOPIA maybe? Unused for now.
  //export let visualize_decision_space: boolean = false;

  // Enum to represent the state of the method.
  enum State {
    InitialLoad,
    ClassifySelected,
    IntermediateSelected,
    SaveSolutionsSelected,
  }

  // Enum to represent which solutions the DM wants to visualize.
  enum VisualizationChoiceState {
    CurrentSolutions,
  }

  // The type of the problem info object returned by the backend.
  type problemInfoType = {
    objective_long_names: string[];
    is_maximized: boolean[];
    lower_bounds: number[];
    upper_bounds: number[];
    previous_preference: number[];
    current_solutions: number[][];
    current_shap: number[][];
    current_explanations: string[];
  };
  type solutionType = {
    description: string;
    objective_values: number[];
    reference_point: number[];
    shap_values: number[][];
    explanations: string[];
  };

  let solutions: solutionType[] = [
    {
      description: "Optimistic reference point",
      objective_values: [
        -5.74608375, -2.91090165, -6.9068179, 0.20337037, 0.13540173,
      ],
      reference_point: [-6.34, -3.44, -7.5, 0, 0],
      shap_values: [
        [
          -0.6082285007708907, -0.000707120653047543, 2.365298151140183,
          -0.35076221562481014, -0.06591460627429277,
        ],
        [
          -0.10308485325189518, -0.08948156088690873, 0.6569954883039429,
          1.8649100852552642, 0.020392996566525896,
        ],
        [
          0.8195437155537564, 0.06632962997647938, -4.564855917274605,
          -0.9583695687444805, -0.09892579893653615,
        ],
        [
          -0.04468487194159144, 0.29599769006975435, 0.14138266207415207,
          -3.981249734411196, 0.014711969783340356,
        ],
        [
          -0.0032434459478982713, -0.00033616178730150326, 0.004177414010559932,
          0.004282791563043453, 2.658811654948634e-5,
        ],
      ],
      explanations: [
        "Explanation: Each objective value in the solution is worse when compared to the reference point. The reference point given was too demanding. The component Objective 3 in the reference point had the most impairing effect on objective Objective 1 in the solution.\nSuggestion: Try improving the component Objective 1 and impairing the component Objective 3.",
        "Explanation: Each objective value in the solution is worse when compared to the reference point. The reference point given was too demanding. The component Objective 4 in the reference point had the most impairing effect on objective Objective 2 in the solution.\nSuggestion: Try improving the component Objective 2 and impairing the component Objective 4.",
        "Explanation: Each objective value in the solution is worse when compared to the reference point. The reference point given was too demanding. The component Objective 1 in the reference point had the most impairing effect on objective Objective 3 in the solution.\nSuggestion: Try improving the component Objective 3 and impairing the component Objective 1.",
        "Explanation: Each objective value in the solution is worse when compared to the reference point. The reference point given was too demanding. The component Objective 2 in the reference point had the most impairing effect on objective Objective 4 in the solution.\nSuggestion: Try improving the component Objective 4 and impairing the component Objective 2.",
        "Explanation: Each objective value in the solution is worse when compared to the reference point. The reference point given was too demanding. The component Objective 4 in the reference point had the most impairing effect on objective Objective 5 in the solution.\nSuggestion: Try improving the component Objective 5 and impairing the component Objective 4.",
      ],
    },
    {
      description: "Pesimistic reference point",
      objective_values: [
        -5.99961942, -3.10799147, -6.27755692, 1.66335202, 0.20091479,
      ],
      reference_point: [-4.751, -2.85595261, -0.32111111, 9.70666667, 0.35],
      shap_values: [
        [
          0.08232780797566096, 0.019520080927165628, -0.7606810780763054,
          -0.36856838513740653, -0.029194050578624377,
        ],
        [
          0.10336844293920648, 0.10279253251017428, -1.0070466704760204,
          -1.7995318886367055, -0.047990225112473216,
        ],
        [
          -0.34946214645018153, 0.007054147576319551, 0.9990153173486036,
          -0.33996460044277427, -0.003171241562519754,
        ],
        [
          0.034356288886672415, -0.03510515324007928, -0.34902695771141046,
          0.3695948313466284, -0.009525827062155493,
        ],
        [
          -0.06382402295776021, -0.019548945216339653, 0.349998163770189,
          0.17726304449356967, 0.02568554563106086,
        ],
      ],
      explanations: [
        "Explanation: Each objective value in the solution had a bettern value when compared to the reference point. The reference point was pessimistic. The component Objective 2 in the refence point had the least improving effect on the objective Objective 1 in the solution.\nSuggestion: Try improving the component Objective 1 and impairing the component Objective 2.",
        "Explanation: Each objective value in the solution had a bettern value when compared to the reference point. The reference point was pessimistic. The component Objective 1 in the refence point had the least improving effect on the objective Objective 2 in the solution.\nSuggestion: Try improving the component Objective 2 and impairing the component Objective 1.",
        "Explanation: Each objective value in the solution had a better value when compared to the reference point.The reference point was pessimistic. The component Objective 3 in the reference point had the least improving effect on objective Objective 3 in the solution. The component Objective 2 had the second least improving effect on the objective Objective 3.\nSuggestion: Try improving the component Objective 3 and impairing the component Objective 2.",
        "Explanation: Each objective value in the solution had a better value when compared to the reference point.The reference point was pessimistic. The component Objective 4 in the reference point had the least improving effect on objective Objective 4 in the solution. The component Objective 1 had the second least improving effect on the objective Objective 4.\nSuggestion: Try improving the component Objective 4 and impairing the component Objective 1.",
        "Explanation: Each objective value in the solution had a bettern value when compared to the reference point. The reference point was pessimistic. The component Objective 3 in the refence point had the least improving effect on the objective Objective 5 in the solution.\nSuggestion: Try improving the component Objective 5 and impairing the component Objective 3.",
      ],
    },
    {
      description: "Optimistic reference point",
      objective_values: [
        -6.00345962, -2.91928927, -6.26229508, 0.21316082, 0.20174433,
      ],
      reference_point: [-6, -3.2, -6.0, 0.1, 0.1],
      shap_values: [
        [
          0.004280237176539252, 0.007413895737360971, -0.483937992334114,
          -0.10188277289418518, -0.017141842065165388,
        ],
        [
          0.0246457504475303, 0.03662135153711577, -0.7283604491506108,
          -0.6702866047828461, -0.014716242748077911,
        ],
        [
          -0.2070728223028497, -0.002142501614164864, 0.21669451803035128,
          -0.05452464752482899, 0.0024593705263770767,
        ],
        [
          -0.09111362491129119, 0.17206395179244688, 0.8286678891717021,
          -1.8660718850579148, 0.020434617057692808,
        ],
        [
          0.0721866328121003, 0.04945816128211339, -0.5855433498248166,
          -0.7186322874337727, -0.054402162828639064,
        ],
      ],
      explanations: [
        "Explanation: The objective Objective 1 was most improved in the solution by the component Objective 3 and most impaired by the component Objective 2 in the reference point.\nSuggestion: Try improving the component Objective 1 and impairing the component Objective 2.",
        "Explanation: The objective Objective 2 was most impaired in the solution by its component in the reference point. The component Objective 1 had the second most impairing effect on the objective Objective 2.\nSuggestion: Try improving the component Objective 2 and impairing the component Objective 1.",
        "Explanation: The objective Objective 3 was most impaired in the solution by its component in the reference point. The component Objective 5 had the second most impairing effect on the objective Objective 3.\nSuggestion: Try improving the component Objective 3 and impairing the component Objective 5.",
        "Explanation: The objective Objective 4 was most improved in the solution by its component in the reference point. The component Objective 3 had the most impairing effect of objective Objective 4.\nSuggestion: Try improving the component Objective 4 and impairing the component Objective 3.",
        "Explanation: The objective Objective 5 was most improved in the solution by the component Objective 4 and most impaired by the component Objective 1 in the reference point.\nSuggestion: Try improving the component Objective 5 and impairing the component Objective 1.",
      ],
    },
    {
      description: "Optimistic reference point",
      objective_values: [
        -5.90002751, -3.05750649, -6.59663711, 1.20663092, 0.15617952,
      ],
      reference_point: [-6, -3.2, -6.0, 1, 0.1],
      shap_values: [
        [
          0.01000648425547853, 0.0045294520552264655, -0.5289871098665174,
          -0.08632736101265501, -0.021020476026540252,
        ],
        [
          0.024443385017591825, 0.03020854037937561, -0.391084012490849,
          -0.7576582888125346, -0.014208353484995712,
        ],
        [
          -0.1938555864559639, -0.0019406278455032662, 0.11262071484170526,
          -0.05389655963242717, -0.0060082786506903355,
        ],
        [
          -0.018503223442102545, 0.03459217477624763, 0.23118523644384936,
          -0.726184332950595, -0.008826478556888917,
        ],
        [
          0.08426722191781977, 0.057808101797993755, -0.5105562413833893,
          -0.7938615588022513, -0.058867478656227955,
        ],
      ],
      explanations: [
        "Explanation: The objective Objective 1 was most impaired in the solution by its component in the reference point. The component Objective 2 had the second most impairing effect on the objective Objective 1.\nSuggestion: Try improving the component Objective 1 and impairing the component Objective 2.",
        "Explanation: The objective Objective 2 was most impaired in the solution by its component in the reference point. The component Objective 1 had the second most impairing effect on the objective Objective 2.\nSuggestion: Try improving the component Objective 2 and impairing the component Objective 1.",
        "Explanation: The objective Objective 3 was most impaired in the solution by its component in the reference point. The component Objective 2 had the second most impairing effect on the objective Objective 3.\nSuggestion: Try improving the component Objective 3 and impairing the component Objective 2.",
        "Explanation: The objective Objective 4 was most improved in the solution by its component in the reference point. The component Objective 3 had the most impairing effect of objective Objective 4.\nSuggestion: Try improving the component Objective 4 and impairing the component Objective 3.",
        "Explanation: The objective Objective 5 was most improved in the solution by the component Objective 4 and most impaired by the component Objective 1 in the reference point.\nSuggestion: Try improving the component Objective 5 and impairing the component Objective 1.",
      ],
    },
    {
      description: "Optimistic reference point",
      objective_values: [
        -5.95206821, -3.06336352, -6.44639728, 1.24607038, 0.17910494,
      ],
      reference_point: [-6, -3.2, -5.5, 0.8, 0.12],
      shap_values: [
        [
          0.0029064904587753604, 0.003492084257043458, -0.5062318788811963,
          -0.06792903178744268, -0.018690773514580275,
        ],
        [
          0.02724277414151736, 0.027714994673892965, -0.5586714937708296,
          -0.7307785275875508, -0.013596774905201161,
        ],
        [
          -0.21768072958799214, -0.002238640942598349, 0.2739868664273693,
          -0.08089484042540025, -4.0484318092023425e-5,
        ],
        [
          -0.028346964975635585, 0.048877583157491314, 0.3622676731796052,
          -0.8807778475899458, -0.006404087852124278,
        ],
        [
          0.07019600798439357, 0.04149458641265302, -0.5079327490667939,
          -0.6181083900974713, -0.047273524841836626,
        ],
      ],
      explanations: [
        "Explanation: The objective Objective 1 was most improved in the solution by the component Objective 3 and most impaired by the component Objective 2 in the reference point.\nSuggestion: Try improving the component Objective 1 and impairing the component Objective 2.",
        "Explanation: The objective Objective 2 was most impaired in the solution by its component in the reference point. The component Objective 1 had the second most impairing effect on the objective Objective 2.\nSuggestion: Try improving the component Objective 2 and impairing the component Objective 1.",
        "Explanation: The objective Objective 3 was most impaired in the solution by its component in the reference point. The component Objective 5 had the second most impairing effect on the objective Objective 3.\nSuggestion: Try improving the component Objective 3 and impairing the component Objective 5.",
        "Explanation: The objective Objective 4 was most improved in the solution by its component in the reference point. The component Objective 3 had the most impairing effect of objective Objective 4.\nSuggestion: Try improving the component Objective 4 and impairing the component Objective 3.",
        "Explanation: The objective Objective 5 was most improved in the solution by the component Objective 4 and most impaired by the component Objective 1 in the reference point.\nSuggestion: Try improving the component Objective 5 and impairing the component Objective 1.",
      ],
    },
    {
      description: "Optimistic reference point",
      objective_values: [
        -5.95206821, -3.06336352, -6.44639728, 1.24607038, 0.17910494,
      ],
      reference_point: [-6, -3.2, -5.5, 0.8, 0.12],
      shap_values: [
        [
          0.0029064904587753604, 0.003492084257043458, -0.5062318788811963,
          -0.06792903178744268, -0.018690773514580275,
        ],
        [
          0.02724277414151736, 0.027714994673892965, -0.5586714937708296,
          -0.7307785275875508, -0.013596774905201161,
        ],
        [
          -0.21768072958799214, -0.002238640942598349, 0.2739868664273693,
          -0.08089484042540025, -4.0484318092023425e-5,
        ],
        [
          -0.028346964975635585, 0.048877583157491314, 0.3622676731796052,
          -0.8807778475899458, -0.006404087852124278,
        ],
        [
          0.07019600798439357, 0.04149458641265302, -0.5079327490667939,
          -0.6181083900974713, -0.047273524841836626,
        ],
      ],
      explanations: [
        "Explanation: The objective Objective 1 was most improved in the solution by the component Objective 3 and most impaired by the component Objective 2 in the reference point.\nSuggestion: Try improving the component Objective 1 and impairing the component Objective 2.",
        "Explanation: The objective Objective 2 was most impaired in the solution by its component in the reference point. The component Objective 1 had the second most impairing effect on the objective Objective 2.\nSuggestion: Try improving the component Objective 2 and impairing the component Objective 1.",
        "Explanation: The objective Objective 3 was most impaired in the solution by its component in the reference point. The component Objective 5 had the second most impairing effect on the objective Objective 3.\nSuggestion: Try improving the component Objective 3 and impairing the component Objective 5.",
        "Explanation: The objective Objective 4 was most improved in the solution by its component in the reference point. The component Objective 3 had the most impairing effect of objective Objective 4.\nSuggestion: Try improving the component Objective 4 and impairing the component Objective 3.",
        "Explanation: The objective Objective 5 was most improved in the solution by the component Objective 4 and most impaired by the component Objective 1 in the reference point.\nSuggestion: Try improving the component Objective 5 and impairing the component Objective 1.",
      ],
    },
    {
      description: "Optimistic reference point",
      objective_values: [
        -5.95206821, -3.06336352, -6.44639728, 1.24607038, 0.17910494,
      ],
      reference_point: [-6, -3.2, -5.5, 0.8, 0.12],
      shap_values: [
        [
          0.0029064904587753604, 0.003492084257043458, -0.5062318788811963,
          -0.06792903178744268, -0.018690773514580275,
        ],
        [
          0.02724277414151736, 0.027714994673892965, -0.5586714937708296,
          -0.7307785275875508, -0.013596774905201161,
        ],
        [
          -0.21768072958799214, -0.002238640942598349, 0.2739868664273693,
          -0.08089484042540025, -4.0484318092023425e-5,
        ],
        [
          -0.028346964975635585, 0.048877583157491314, 0.3622676731796052,
          -0.8807778475899458, -0.006404087852124278,
        ],
        [
          0.07019600798439357, 0.04149458641265302, -0.5079327490667939,
          -0.6181083900974713, -0.047273524841836626,
        ],
      ],
      explanations: [
        "Explanation: The objective Objective 1 was most improved in the solution by the component Objective 3 and most impaired by the component Objective 2 in the reference point.\nSuggestion: Try improving the component Objective 1 and impairing the component Objective 2.",
        "Explanation: The objective Objective 2 was most impaired in the solution by its component in the reference point. The component Objective 1 had the second most impairing effect on the objective Objective 2.\nSuggestion: Try improving the component Objective 2 and impairing the component Objective 1.",
        "Explanation: The objective Objective 3 was most impaired in the solution by its component in the reference point. The component Objective 5 had the second most impairing effect on the objective Objective 3.\nSuggestion: Try improving the component Objective 3 and impairing the component Objective 5.",
        "Explanation: The objective Objective 4 was most improved in the solution by its component in the reference point. The component Objective 3 had the most impairing effect of objective Objective 4.\nSuggestion: Try improving the component Objective 4 and impairing the component Objective 3.",
        "Explanation: The objective Objective 5 was most improved in the solution by the component Objective 4 and most impaired by the component Objective 1 in the reference point.\nSuggestion: Try improving the component Objective 5 and impairing the component Objective 1.",
      ],
    },
  ];

  // The current state of the method.
  let state: State = State.InitialLoad;
  let visualizationChoiceState: VisualizationChoiceState =
    VisualizationChoiceState.CurrentSolutions;

  // Preference input values.
  let preference: (number | undefined)[];

  let problemInfo: problemInfoType;

  let current_iteration: number = 0;
  let total_iterations: number = 6;

  // Indexes of currently selected solutions.
  let selected_solutions: number[];

  // The reference solution to be used in the classification preference input component.
  let reference_solution: number[] | undefined;

  // The objective values of the solutions to be visualized.
  let solutions_to_visualize: number[][];

  // The number of decimals to show for numeric values.
  let decimals = 2;

  // Flags to check if the classification/intermediate/save selection are valid.
  let is_classification_valid = false;
  let is_intermediate_selection_valid = false;
  let is_save_solutions_valid = false;

  let max_multiplier: number[] | undefined = undefined;
  let classification_checker = false;

  let to_impair: boolean[];
  let to_improve: boolean[];

  let show_explanations: boolean = false;

  let draw_map = false;

  let finalChoiceState = false;

  $: {
    if (problemInfo !== undefined) {
      max_multiplier = problemInfo.is_maximized.map((value) => {
        if (value) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  }

  /* eslint-disable */
  // Had to disable this rule because it was giving an error for the following code
  // and it was too annoying for me to fix it.
  $: {
    if (max_multiplier === undefined || preference === undefined) {
      classification_checker = false;
    } else {
      const pref_less_ref = preference.some(
        (value, index) =>
          roundToDecimal(value! * max_multiplier![index], decimals) <
          roundToDecimal(
            reference_solution![index] * max_multiplier![index],
            decimals
          )
      );

      const pref_greater_ref = preference.some(
        (value, index) =>
          roundToDecimal(value! * max_multiplier![index], decimals) >
          roundToDecimal(
            reference_solution![index] * max_multiplier![index],
            decimals
          )
      );

      if (pref_less_ref && pref_greater_ref) {
        classification_checker = true;
      } else {
        classification_checker = false;
      }
    }
  }

  /* eslint-enable */
  // Check if the intermediate selection is valid. Exactly two solutions must be selected.
  $: {
    if (!(state === State.IntermediateSelected)) {
      is_intermediate_selection_valid = false;
    } else if (selected_solutions?.length !== 2) {
      is_intermediate_selection_valid = false;
    } else {
      is_intermediate_selection_valid = true;
    }
  }

  // Check if the save solutions selection is valid. At least one solution must be selected.
  $: {
    if (!(state === State.SaveSolutionsSelected)) {
      is_save_solutions_valid = false;
    } else if (selected_solutions?.length === 0) {
      is_save_solutions_valid = false;
    } else {
      is_save_solutions_valid = true;
    }
  }

  // Get the reference solution to be used in the classification preference input component.
  $: {
    if (
      solutions_to_visualize !== undefined &&
      selected_solutions?.length >= 1
    ) {
      // if any selected solution index is larger than the number of solutions, set reference_solution to the last solution
      if (
        selected_solutions.some(
          (index) => index >= solutions_to_visualize.length
        )
      ) {
        reference_solution =
          solutions_to_visualize[solutions_to_visualize.length - 1];
        selected_solutions = [solutions_to_visualize.length - 1];
      } else {
        reference_solution =
          solutions_to_visualize[
            selected_solutions[selected_solutions.length - 1]
          ];
      }
    }
  }

  $: {
    if (selected_solutions?.length === 0 || selected_solutions === undefined) {
      selected_solutions = [0];
    } else if (
      selected_solutions.length === 1 &&
      selected_solutions[0] === undefined
    ) {
      selected_solutions = [0];
    } else if (
      state === State.ClassifySelected &&
      selected_solutions.length !== 1
    ) {
      selected_solutions = [selected_solutions[selected_solutions.length - 1]];
      selected_solutions = selected_solutions;
    }
  }

  $: {
    if (problemInfo !== undefined) {
      solutions_to_visualize = problemInfo.current_solutions;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  let visualizations_maximized = false;
  let visualizations_tab = 0;
  let gridded_visualizations = false;

  // Always use tab mode if not in maximized mode.
  $: if (!visualizations_maximized) {
    gridded_visualizations = false;
  }

  //
  // The handlers
  //
  async function handle_initialize() {
    problemInfo = {
      objective_long_names: ["f_1", "f_2", "f_3", "f_4", "f_5"],
      is_maximized: [false, false, false, false, false],
      lower_bounds: [-6.34, -3.44487179, -7.5, 0.0, 1.71409445e-3],
      upper_bounds: [-4.751, -2.85595261, -0.32111111, 9.70666667, 0.35],
      previous_preference: solutions[0].reference_point,
      current_solutions: [solutions[0].objective_values],
      current_explanations: solutions[0].explanations,
      current_shap: solutions[0].shap_values,
    };

    preference = problemInfo.previous_preference;
    state = State.ClassifySelected;
    reference_solution = problemInfo.current_solutions[0];
    selected_solutions = [0];

    state = State.ClassifySelected;
    decimals = 3;
  }

  //
  // TODO: Handle errors better.
  //
  onMount(async () => {
    await handle_initialize();
  });

  async function handle_iterate() {
    if (current_iteration < total_iterations - 1) {
      current_iteration = current_iteration + 1;
      problemInfo = {
        objective_long_names: ["f_1", "f_2", "f_3", "f_4", "f_5"],
        is_maximized: [false, false, false, false, false],
        lower_bounds: [-6.34, -3.44487179, -7.5, 0.0, 1.71409445e-3],
        upper_bounds: [-4.751, -2.85595261, -0.32111111, 9.70666667, 0.35],
        previous_preference: solutions[current_iteration].reference_point,
        current_solutions: [solutions[current_iteration].objective_values],
        current_explanations: solutions[current_iteration].explanations,
        current_shap: solutions[current_iteration].shap_values,
      };
      preference = problemInfo.previous_preference;
      state = State.ClassifySelected;
      visualizationChoiceState = VisualizationChoiceState.CurrentSolutions;
      reference_solution = problemInfo.current_solutions[0];
      selected_solutions = [0];
      show_explanations = false;
    }
  }
</script>

<div class="flex flex-col gap-10">
  {#if state === State.InitialLoad}
    <div class="grid grid-cols-2 items-start gap-10">
      <!-- <ProblemDetails {problem} /> -->
    </div>
  {:else}
    <RpmLayout
      classify={state === State.ClassifySelected ? true : false}
      finalChoice={finalChoiceState}
      drawMap={draw_map}
    >
      <div slot="preferences" class="pl-2 pr-2">
        {#if problemInfo !== undefined && reference_solution !== undefined}
          Provide classification
          <div class="pb-2 pt-2 text-sm">
            Provide your preferences by classifying the objectives by either
            clicking on the bars or using the input boxes. You must give a
            preference for each objective. You must improve and impair at least
            one objective.
          </div>
          <ClassificationPreference
            objective_long_names={problemInfo.objective_long_names}
            is_maximized={problemInfo.is_maximized}
            lower_bounds={problemInfo.lower_bounds}
            upper_bounds={problemInfo.upper_bounds}
            solutionValue={reference_solution}
            previousValue={problemInfo.previous_preference}
            bind:preference
            decimalPrecision={decimals}
            bind:to_impair
            bind:to_improve
            bind:show_explanations
          />

          <div class="flex gap-4">
            <button
              class="btn variant-filled inline"
              on:click={handle_iterate}
              disabled={current_iteration >= total_iterations}>Iterate</button
            >
          </div>
          {#if current_iteration >= total_iterations}
            <div class="text-error-500">
              You have reached the last iteration.
            </div>
          {/if}
        {:else}
          <GeneralError />
        {/if}
      </div>
      <div slot="visualizations" style="padding-top:0">
        {#if problemInfo !== undefined && solutions_to_visualize !== undefined}
          <Visualizations
            names={problemInfo.objective_long_names}
            values={solutions_to_visualize}
            reference_point={problemInfo.previous_preference}
            bind:preference
            multipliers={problemInfo.current_shap}
            lower_bounds={problemInfo.lower_bounds}
            upper_bounds={problemInfo.upper_bounds}
            lower_is_better={problemInfo.is_maximized.map((value) => !value)}
            grid_mode={gridded_visualizations}
            bind:selected={selected_solutions}
            bind:tab={visualizations_tab}
            max_selections={1}
            bind:to_impair
            bind:to_improve
            bind:show_explanations
          />
        {:else}
          <GeneralError />
        {/if}
      </div>
      <div slot="solutions">
        <div class="flex flex-col gap-4">
          <div class="overflow-x-auto">
            {#if problemInfo !== undefined && solutions_to_visualize !== undefined}
              {#if !finalChoiceState}
                <Table
                  head={["Solution ID", ...problemInfo.objective_long_names]}
                  body={solutions_to_visualize.map((solution, index) => {
                    return [
                      `Solution ${index + 1}`, // Add the ID for the solution
                      ...solution.map((value) => value.toFixed(decimals)),
                    ];
                  })}
                  bind:selected_rows={selected_solutions}
                />
              {:else if reference_solution !== undefined}
                <Table
                  head={["Solution ID", ...problemInfo.objective_long_names]}
                  body={[reference_solution].map((solution, index) => {
                    return [
                      `Solution ${index + 1}`, // Add the ID for the solution
                      ...solution.map((value) => value.toFixed(decimals)), // Append the rest of the values
                    ];
                  })}
                />
              {/if}
            {:else}
              <GeneralError />
            {/if}
          </div>
        </div>
      </div>
    </RpmLayout>
  {/if}
</div>
