import { skeleton } from "@skeletonlabs/tw-plugin";
//import forms from '@tailwindcss/forms';
//import { join } from 'path';
import { desdeo } from "./src/desdeo";

const { join } = require("path");
const forms = require("@tailwindcss/forms");
//const skeleton = require("@skeletonlabs/skeleton/tailwind/skeleton.cjs");

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}"
    ),
  ],
  theme: {
    extend: {},
  },
  //plugins: [forms, ...skeleton()],
  plugins: [
    skeleton({
      themes: {
        custom: [desdeo],
      },
    }),
    forms,
  ],
};
