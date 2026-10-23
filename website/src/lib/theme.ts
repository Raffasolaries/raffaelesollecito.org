/**
 * Runs before first paint (inline in <head>): an explicit choice saved by the theme toggle wins,
 * otherwise the visitor's system setting decides. Prevents a light/dark flash on load.
 */
export const THEME_INIT_SCRIPT = `(function(){var d;try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){d=t==="dark"}}catch(e){}if(d===undefined){d=!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}if(d){document.documentElement.classList.add("dark")}})()`;

/** Browser UI color per system scheme (washi in light, sumi ink in dark). */
export const THEME_COLORS = [
  { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
  { media: "(prefers-color-scheme: dark)", color: "#0e1217" },
];
