<!--
@component
A simple table.
-->
<script lang="ts">
    import Header from "$lib/components/main/Header.svelte";
    import ProblemDetails from "$lib/components/main/ProblemDetails.svelte";

  /** Heading values. */

  export let problem_info: problemInfoType;
  export let solution_list: Solution[];



  /** Indexes of the selected rows. */
  export let selected_rows: number[] = [];

  //
  // The following are utility functions that were faster to write than look for
  // existing implementations.
  //
  // TODO: Move to some location where they can be used by other parts of the
  // codebase if desired.
  //

  function is_in<T>(arr: T[], e: T): boolean {
    return arr.findIndex((v) => v === e) !== -1;
  }

  function remove<T>(arr: T[], e: T): T[] {
    return arr.filter((v) => v !== e);
  }

  /**
   * Adds an element to the end if not already in the array. Existing element is
   * moved to the end.
   */
  function add<T>(arr: T[], e: T): T[] {
    return [...remove(arr, e), e];
  }

  function toggle<T>(arr: T[], e: T): T[] {
    return is_in(arr, e) ? remove(arr, e) : add(arr, e);
  }

  function createHeader(problem_info:problemInfoType){
    let header_table = ["Id", "Iteration"];
    header_table.push(...problem_info.objective_short_names);
    header_table.push(...problem_info.variable_names);
    return header_table;
  }

  function createBody(solutions_to_visualize: Solution[]){
    let body_table: number[][] = []
    for (let index = 0; index < solutions_to_visualize.length; index++) {
      let element = solutions_to_visualize[index];
      let row_data = [];
      row_data.push(element.index, element.iteration);
      row_data.push(...element.objective_values);
      row_data.push(...element.decision_variables);
      body_table.push(row_data);
    }
    return body_table
  }
 // Reactive re-computation of table head and body
  $: head = createHeader(problem_info);
  $: body = createBody(solution_list);
  console.log(body);
</script>

<table class="table-comfortable">
  <thead class="bg-surface-200">
    {#each head as item}
      <th class="p-4">{item}</th>
    {/each}
  </thead>
  <tbody class="text-sm">
    {#each body as row, row_id}
      {@const background = is_in(selected_rows, row_id)
        ? "bg-surface-400"
        : "bg-surface-100"}
      <tr
        class="border-b-2 border-surface-200 {background} last:border-none hover:cursor-pointer"
      >
        {#each row as item}
          <td
            class="table-cell text-center"
            on:click={() => {
              selected_rows = toggle(selected_rows, row_id);
            }}>{item}</td
          >
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
