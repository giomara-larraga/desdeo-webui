import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const desdeo: CustomThemeConfig = {
  name: "desdeo",
  properties: {
    // =~= Theme Properties =~=
    "--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    "--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    "--theme-font-color-base": "0 0 0",
    "--theme-font-color-dark": "255 255 255",
    "--theme-rounded-base": "6px",
    "--theme-rounded-container": "6px",
    "--theme-border-base": "1px",
    // =~= Theme On-X Colors =~=
    "--on-primary": "255 255 255",
    "--on-secondary": "255 255 255",
    "--on-tertiary": "255 255 255",
    "--on-success": "0 0 0",
    "--on-warning": "0 0 0",
    "--on-error": "255 255 255",
    "--on-surface": "0 0 0",
    // =~= Theme Colors  =~=
    // primary | #0a2463
    "--color-primary-50": "218 222 232", // #dadee8
    "--color-primary-100": "206 211 224", // #ced3e0
    "--color-primary-200": "194 200 216", // #c2c8d8
    "--color-primary-300": "157 167 193", // #9da7c1
    "--color-primary-400": "84 102 146", // #546692
    "--color-primary-500": "10 36 99", // #0a2463
    "--color-primary-600": "9 32 89", // #092059
    "--color-primary-700": "8 27 74", // #081b4a
    "--color-primary-800": "6 22 59", // #06163b
    "--color-primary-900": "5 18 49", // #051231
    // secondary | #871e84
    "--color-secondary-50": "237 221 237", // #eddded
    "--color-secondary-100": "231 210 230", // #e7d2e6
    "--color-secondary-200": "225 199 224", // #e1c7e0
    "--color-secondary-300": "207 165 206", // #cfa5ce
    "--color-secondary-400": "171 98 169", // #ab62a9
    "--color-secondary-500": "135 30 132", // #871e84
    "--color-secondary-600": "122 27 119", // #7a1b77
    "--color-secondary-700": "101 23 99", // #651763
    "--color-secondary-800": "81 18 79", // #51124f
    "--color-secondary-900": "66 15 65", // #420f41
    // tertiary | #4DB5BD
    "--color-tertiary-50": "228 244 245", // #e4f4f5
    "--color-tertiary-100": "219 240 242", // #dbf0f2
    "--color-tertiary-200": "211 237 239", // #d3edef
    "--color-tertiary-300": "184 225 229", // #b8e1e5
    "--color-tertiary-400": "130 203 209", // #82cbd1
    "--color-tertiary-500": "77 181 189", // #4DB5BD
    "--color-tertiary-600": "69 163 170", // #45a3aa
    "--color-tertiary-700": "58 136 142", // #3a888e
    "--color-tertiary-800": "46 109 113", // #2e6d71
    "--color-tertiary-900": "38 89 93", // #26595d
    // success | #12af54
    "--color-success-50": "219 243 229", // #dbf3e5
    "--color-success-100": "208 239 221", // #d0efdd
    "--color-success-200": "196 235 212", // #c4ebd4
    "--color-success-300": "160 223 187", // #a0dfbb
    "--color-success-400": "89 199 135", // #59c787
    "--color-success-500": "18 175 84", // #12af54
    "--color-success-600": "16 158 76", // #109e4c
    "--color-success-700": "14 131 63", // #0e833f
    "--color-success-800": "11 105 50", // #0b6932
    "--color-success-900": "9 86 41", // #095629
    // warning | #ffc300
    "--color-warning-50": "255 246 217", // #fff6d9
    "--color-warning-100": "255 243 204", // #fff3cc
    "--color-warning-200": "255 240 191", // #fff0bf
    "--color-warning-300": "255 231 153", // #ffe799
    "--color-warning-400": "255 213 77", // #ffd54d
    "--color-warning-500": "255 195 0", // #ffc300
    "--color-warning-600": "230 176 0", // #e6b000
    "--color-warning-700": "191 146 0", // #bf9200
    "--color-warning-800": "153 117 0", // #997500
    "--color-warning-900": "125 96 0", // #7d6000
    // error | #d90429
    "--color-error-50": "249 217 223", // #f9d9df
    "--color-error-100": "247 205 212", // #f7cdd4
    "--color-error-200": "246 192 202", // #f6c0ca
    "--color-error-300": "240 155 169", // #f09ba9
    "--color-error-400": "228 79 105", // #e44f69
    "--color-error-500": "217 4 41", // #d90429
    "--color-error-600": "195 4 37", // #c30425
    "--color-error-700": "163 3 31", // #a3031f
    "--color-error-800": "130 2 25", // #820219
    "--color-error-900": "106 2 20", // #6a0214
    // surface | #e5e7eb
    "--color-surface-50": "251 251 252", // #fbfbfc
    "--color-surface-100": "250 250 251", // #fafafb
    "--color-surface-200": "249 249 250", // #f9f9fa
    "--color-surface-300": "245 245 247", // #f5f5f7
    "--color-surface-400": "237 238 241", // #edeef1
    "--color-surface-500": "229 231 235", // #e5e7eb
    "--color-surface-600": "206 208 212", // #ced0d4
    "--color-surface-700": "172 173 176", // #acadb0
    "--color-surface-800": "137 139 141", // #898b8d
    "--color-surface-900": "112 113 115", // #707173
  },
};
