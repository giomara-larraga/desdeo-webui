<script lang="ts">
  export let value: number | undefined;
  // export let higherBound: number|undefined = undefined;
  // export let lowerBound: number|undefined = undefined;
  export let labelName = "Value: ";
  export let onChange: () => void;
</script>

<div class="ts">
  <label for="box" style="font-size: x-small;"> {labelName}</label>
  <input
    name="box"
    class="input"
    style="font-size:small; padding:0.1rem; padding-left: 0.2rem; padding-right: 0.2rem; height:fit-content"
    type="number"
    step="any"
    bind:value
    on:change={() => {
      onChange();
    }}
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    justify-items: center;
    width: 100%;
  }

  /*input {
    width: inherit;
    height: 1.4em;
    border-radius: 4px;
    border: 1px solid #ccc;
    color: gray;
    font-weight: 600;
  }*/

  label {
    color: gray;
    font-size: x-small;
    margin-bottom: 0.25em;
  }
  /* .error{
    color: red;
  } */
</style>
