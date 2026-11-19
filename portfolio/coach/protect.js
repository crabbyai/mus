/* Copy notice for Adeel's coach pages: anything copied carries the source and
   the rights line. Locked teachings hold placeholder text only, so there is
   nothing real to copy there. */
(function () {
  "use strict";
  var NOTE = "\n\n— Source: Adeel Ahmed Rahman, https://crabbyai.github.io/mus/ · © All rights reserved. Not licensed for reproduction or for training or prompting AI systems.";
  document.addEventListener("copy", function (e) {
    var sel = String(window.getSelection ? window.getSelection() : "");
    if (!sel || sel.length < 40 || !e.clipboardData) return;
    e.clipboardData.setData("text/plain", sel + NOTE);
    e.preventDefault();
  });
})();
