import { writable } from "svelte/store";
import skio from "./socket";

//export const show_extra_menu = writable(false);
export const socket = writable(skio.get());
