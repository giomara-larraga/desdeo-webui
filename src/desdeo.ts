
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const desdeo: CustomThemeConfig = {
    name: 'desdeo',
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
		"--on-primary": "0 0 0",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "0 0 0",
		// =~= Theme Colors  =~=
		// primary | #4DB5BD 
		"--color-primary-50": "228 244 245", // #e4f4f5
		"--color-primary-100": "219 240 242", // #dbf0f2
		"--color-primary-200": "211 237 239", // #d3edef
		"--color-primary-300": "184 225 229", // #b8e1e5
		"--color-primary-400": "130 203 209", // #82cbd1
		"--color-primary-500": "77 181 189", // #4DB5BD
		"--color-primary-600": "69 163 170", // #45a3aa
		"--color-primary-700": "58 136 142", // #3a888e
		"--color-primary-800": "46 109 113", // #2e6d71
		"--color-primary-900": "38 89 93", // #26595d
		// secondary | #094277 
		"--color-secondary-50": "218 227 235", // #dae3eb
		"--color-secondary-100": "206 217 228", // #ced9e4
		"--color-secondary-200": "194 208 221", // #c2d0dd
		"--color-secondary-300": "157 179 201", // #9db3c9
		"--color-secondary-400": "83 123 160", // #537ba0
		"--color-secondary-500": "9 66 119", // #094277
		"--color-secondary-600": "8 59 107", // #083b6b
		"--color-secondary-700": "7 50 89", // #073259
		"--color-secondary-800": "5 40 71", // #052847
		"--color-secondary-900": "4 32 58", // #04203a
		// tertiary | #924a99 
		"--color-tertiary-50": "239 228 240", // #efe4f0
		"--color-tertiary-100": "233 219 235", // #e9dbeb
		"--color-tertiary-200": "228 210 230", // #e4d2e6
		"--color-tertiary-300": "211 183 214", // #d3b7d6
		"--color-tertiary-400": "179 128 184", // #b380b8
		"--color-tertiary-500": "146 74 153", // #924a99
		"--color-tertiary-600": "131 67 138", // #83438a
		"--color-tertiary-700": "110 56 115", // #6e3873
		"--color-tertiary-800": "88 44 92", // #582c5c
		"--color-tertiary-900": "72 36 75", // #48244b
		// success | #27AE60 
		"--color-success-50": "223 243 231", // #dff3e7
		"--color-success-100": "212 239 223", // #d4efdf
		"--color-success-200": "201 235 215", // #c9ebd7
		"--color-success-300": "169 223 191", // #a9dfbf
		"--color-success-400": "104 198 144", // #68c690
		"--color-success-500": "39 174 96", // #27AE60
		"--color-success-600": "35 157 86", // #239d56
		"--color-success-700": "29 131 72", // #1d8348
		"--color-success-800": "23 104 58", // #17683a
		"--color-success-900": "19 85 47", // #13552f
		// warning | #E2B93B 
		"--color-warning-50": "251 245 226", // #fbf5e2
		"--color-warning-100": "249 241 216", // #f9f1d8
		"--color-warning-200": "248 238 206", // #f8eece
		"--color-warning-300": "243 227 177", // #f3e3b1
		"--color-warning-400": "235 206 118", // #ebce76
		"--color-warning-500": "226 185 59", // #E2B93B
		"--color-warning-600": "203 167 53", // #cba735
		"--color-warning-700": "170 139 44", // #aa8b2c
		"--color-warning-800": "136 111 35", // #886f23
		"--color-warning-900": "111 91 29", // #6f5b1d
		// error | #d61e4b 
		"--color-error-50": "249 221 228", // #f9dde4
		"--color-error-100": "247 210 219", // #f7d2db
		"--color-error-200": "245 199 210", // #f5c7d2
		"--color-error-300": "239 165 183", // #efa5b7
		"--color-error-400": "226 98 129", // #e26281
		"--color-error-500": "214 30 75", // #d61e4b
		"--color-error-600": "193 27 68", // #c11b44
		"--color-error-700": "161 23 56", // #a11738
		"--color-error-800": "128 18 45", // #80122d
		"--color-error-900": "105 15 37", // #690f25
		// surface | #FBFAF5 
		"--color-surface-50": "254 254 254", // #fefefe
		"--color-surface-100": "254 254 253", // #fefefd
		"--color-surface-200": "254 254 253", // #fefefd
		"--color-surface-300": "253 253 251", // #fdfdfb
		"--color-surface-400": "252 252 248", // #fcfcf8
		"--color-surface-500": "251 250 245", // #FBFAF5
		"--color-surface-600": "226 225 221", // #e2e1dd
		"--color-surface-700": "188 188 184", // #bcbcb8
		"--color-surface-800": "151 150 147", // #979693
		"--color-surface-900": "123 123 120", // #7b7b78
		
	}
}