import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const desdeo: CustomThemeConfig = {
  name: "desdeo",
  properties: {
    // =~= Theme Properties =~=
    "--theme-font-family-base": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    "--theme-font-family-heading": `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
    "--theme-font-color-base": "0 0 0",
    "--theme-font-color-dark": "255 255 255",
    "--theme-rounded-base": "8px",
    "--theme-rounded-container": "2px",
    "--theme-border-base": "1px",
    // =~= Theme On-X Colors =~=
    "--on-primary": "255 255 255",
    "--on-secondary": "255 255 255",
    "--on-tertiary": "0 0 0",
    "--on-success": "0 0 0",
    "--on-warning": "0 0 0",
    "--on-error": "255 255 255",
    "--on-surface": "0 0 0",
    // =~= Theme Colors  =~=
    // primary | #094277
    "--color-primary-50": "218 227 235", // #dae3eb
    "--color-primary-100": "206 217 228", // #ced9e4
    "--color-primary-200": "194 208 221", // #c2d0dd
    "--color-primary-300": "157 179 201", // #9db3c9
    "--color-primary-400": "83 123 160", // #537ba0
    "--color-primary-500": "9 66 119", // #094277
    "--color-primary-600": "8 59 107", // #083b6b
    "--color-primary-700": "7 50 89", // #073259
    "--color-primary-800": "5 40 71", // #052847
    "--color-primary-900": "4 32 58", // #04203a
    // secondary | #4E46DD
    "--color-secondary-50": "228 227 250", // #e4e3fa
    "--color-secondary-100": "220 218 248", // #dcdaf8
    "--color-secondary-200": "211 209 247", // #d3d1f7
    "--color-secondary-300": "184 181 241", // #b8b5f1
    "--color-secondary-400": "131 126 231", // #837ee7
    "--color-secondary-500": "78 70 221", // #4E46DD
    "--color-secondary-600": "70 63 199", // #463fc7
    "--color-secondary-700": "59 53 166", // #3b35a6
    "--color-secondary-800": "47 42 133", // #2f2a85
    "--color-secondary-900": "38 34 108", // #26226c
    // tertiary | #4BA2E3
    "--color-tertiary-50": "228 241 251", // #e4f1fb
    "--color-tertiary-100": "219 236 249", // #dbecf9
    "--color-tertiary-200": "210 232 248", // #d2e8f8
    "--color-tertiary-300": "183 218 244", // #b7daf4
    "--color-tertiary-400": "129 190 235", // #81beeb
    "--color-tertiary-500": "75 162 227", // #4BA2E3
    "--color-tertiary-600": "68 146 204", // #4492cc
    "--color-tertiary-700": "56 122 170", // #387aaa
    "--color-tertiary-800": "45 97 136", // #2d6188
    "--color-tertiary-900": "37 79 111", // #254f6f
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
    // warning | #E1B53E
    "--color-warning-50": "251 244 226", // #fbf4e2
    "--color-warning-100": "249 240 216", // #f9f0d8
    "--color-warning-200": "248 237 207", // #f8edcf
    "--color-warning-300": "243 225 178", // #f3e1b2
    "--color-warning-400": "234 203 120", // #eacb78
    "--color-warning-500": "225 181 62", // #E1B53E
    "--color-warning-600": "203 163 56", // #cba338
    "--color-warning-700": "169 136 47", // #a9882f
    "--color-warning-800": "135 109 37", // #876d25
    "--color-warning-900": "110 89 30", // #6e591e
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
    // surface | #cdd5f4
    "--color-surface-50": "248 249 253", // #f8f9fd
    "--color-surface-100": "245 247 253", // #f5f7fd
    "--color-surface-200": "243 245 252", // #f3f5fc
    "--color-surface-300": "235 238 251", // #ebeefb
    "--color-surface-400": "220 226 247", // #dce2f7
    "--color-surface-500": "205 213 244", // #cdd5f4
    "--color-surface-600": "185 192 220", // #b9c0dc
    "--color-surface-700": "154 160 183", // #9aa0b7
    "--color-surface-800": "123 128 146", // #7b8092
    "--color-surface-900": "100 104 120", // #646878
  },
};
