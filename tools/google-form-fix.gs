/**
 * Multani Mangoes: PUBLISH your Google Form and fix the title. Your form link stays the same.
 *
 *  1. Go to https://script.google.com → "New project".
 *  2. Delete everything, paste this whole file, click Save (💾).
 *  3. Choose "fixMangoForm" at the top and press ▶ Run. Allow the permissions.
 *  4. Open "Execution log". It should say "PUBLISHED ✓" and show your share link.
 *
 * If it says it can't find the form: open your form in Google Forms (the edit page),
 * copy the address from the browser, and paste it between the quotes on the next line.
 */
var EDIT_LINK = "https://docs.google.com/forms/d/1Tvv9mUXohStLWzDVn8xtmyZLsviNMzDXoB_w2tIm1x0/edit";

function fixMangoForm() {
  var form;
  try { form = FormApp.openByUrl(EDIT_LINK); }
  catch (e) { throw new Error("Couldn't open the form. Paste your form's EDIT link into EDIT_LINK at the top, then Run again."); }

  // Short title: Google shows it in a huge font on phones, so long titles get chopped mid-word
  form.setTitle("Multani Mangoes 🥭");
  var rest = form.getDescription()
    .replace(/^📱 WhatsApp[\s\S]*?\n\n/, "")
    .replace(/^🥭 ORDER NOW[\s\S]*?\n\n/, "");
  form.setDescription(
    "📱 WhatsApp @PakistaniMangoes\n0016134083945 / +1 613 408 3945\n\n" +
    "🥭 ORDER NOW · ابھی آرڈر کریں\nTakes 1 minute. Pickup at 2045 Carling Avenue, Ottawa (lobby). Pay by Interac e-Transfer to siradeelahmedrahman@yahoo.ca.\n\n" +
    rest
  );
  form.setConfirmationMessage("JazakAllah khair! 🥭 Your order is in. Please send your Interac e-Transfer to siradeelahmedrahman@yahoo.ca. Adeel will confirm on WhatsApp (+1 613 408 3945). Tell a friend: https://pakistani.luxury/mangoes/");
  form.setShowLinkToRespondAgain(true);
  form.setRequireLogin(false);          // customers don't need a Google account
  form.setAcceptingResponses(true);

  // New Google Forms start "unpublished": this publishes it so anyone with the link can order
  var published = false;
  try { form.setPublished(true); published = form.isPublished(); }
  catch (e) { Logger.log("Your Google account doesn't support publishing from a script yet: open the form and press the purple 'Publish' button (top right)."); }

  Logger.log(published ? "PUBLISHED ✓ Customers can order now." : "Almost done: open the form and press 'Publish' (top right).");
  Logger.log("Share link: " + form.getPublishedUrl());
  Logger.log("Edit link: " + form.getEditUrl());
}
