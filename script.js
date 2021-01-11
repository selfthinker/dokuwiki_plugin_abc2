// load $ABC_UI (if it is the chosen library)
if (typeof $ABC_UI !== "undefined") {
  $ABC_UI.init();
}

// configure abcjs (if it is the chosen library)
if (typeof window.ABCJS !== "undefined") {
  window.ABCJS.plugin.render_options = {
    responsive: "resize"
  };
}
