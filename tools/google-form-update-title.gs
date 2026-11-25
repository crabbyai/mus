/**
 * Renames your existing Multani Mangoes Google Form (removes "by") without changing its link.
 * script.google.com → New project → paste → Save → Run "renameMangoForm" → allow.
 * If it says the form can't be found, paste your form's EDIT link between the quotes below.
 */
var EDIT_LINK = "https://docs.google.com/forms/d/1Tvv9mUXohStLWzDVn8xtmyZLsviNMzDXoB_w2tIm1x0/edit";

function renameMangoForm() {
  var form = FormApp.openByUrl(EDIT_LINK);
  form.setTitle("Multani Mangoes @PakistaniMangoes on WhatsApp (0016134083945 / 1 613 408 3945)");
  form.setDescription("🥭 ORDER NOW · ابھی آرڈر کریں\nTakes 1 minute. Pickup at 2045 Carling Avenue, Ottawa (lobby). Pay by Interac e-Transfer to siradeelahmedrahman@yahoo.ca.\n\n" + form.getDescription().replace(/^🥭 ORDER NOW[\s\S]*?\n\n/, ""));
  form.setConfirmationMessage("JazakAllah khair! 🥭 Your order is in. Please send your Interac e-Transfer to siradeelahmedrahman@yahoo.ca. Adeel will confirm on WhatsApp (+1 613 408 3945). Tell a friend: https://pakistani.luxury/mangoes/");
  form.setShowLinkToRespondAgain(true);
  Logger.log("Done: " + form.getTitle());
}
