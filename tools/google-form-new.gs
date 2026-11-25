/**
 * Multani Mangoes: creates your Google Form (and a Google Sheet for the answers) in one click.
 *
 * How to use (2 minutes):
 *  1. Open https://script.google.com while signed in to your Google account, click "New project".
 *  2. Delete what's there, paste this whole file, click Save (💾).
 *  3. Pick "createMangoForm" in the function menu at the top and press ▶ Run.
 *  4. Allow the permissions Google asks for (it's your own script, creating a form in your own Drive).
 *  5. Open "Execution log": it should say "PUBLISHED ✓" and show your share link and editing link.
 *     Send the share link to Claude to put it on pakistani.luxury.
 */
function createMangoForm() {
  var form = FormApp.create("Multani Mangoes 🥭");
  form.setDescription(
    "📱 WhatsApp @PakistaniMangoes\n0016134083945 / +1 613 408 3945\n\n" +
    "Premium quality Chaunsa, Sindhri, Dasehri, Langra, Anwar Ratol, Falsa and Jamun, plus Pakistani vegetables.\n\n" +
    "GUARANTEE OF\n" +
    "• Full traceability of mangoes right from the farms\n" +
    "• Organically ripened\n" +
    "• No chemicals used\n" +
    "• Hand-picked for size & quality\n" +
    "• Full weight\n" +
    "عام نہیں، خاص آم\n\n" +
    "Next shipment: summer 2027 insha Allah (exact date announced on WhatsApp)\n" +
    "Pickup: 2045 Carling Avenue, Ottawa, in the lobby\n" +
    "Payment: Interac e-Transfer to siradeelahmedrahman@yahoo.ca\n" +
    "Questions: WhatsApp Adeel Rahman, +1 613 408 3945\n\n" +
    "🥭 ORDER NOW · ابھی آرڈر کریں · takes 1 minute"
  );
  form.setCollectEmail(false);
  form.setConfirmationMessage("JazakAllah khair! Your order is in. Please send your Interac e-Transfer to siradeelahmedrahman@yahoo.ca, and Adeel will confirm on WhatsApp. 🥭");

  form.addTextItem().setTitle("Full name").setRequired(true);
  form.addTextItem().setTitle("WhatsApp / phone number").setRequired(true);
  form.addTextItem().setTitle("Email");

  var items = ["Chaunsa", "Sindhri", "Dasehri", "Langra", "Anwar Ratol", "Falsa", "Jamun", "Pakistani vegetables"];
  var grid = form.addGridItem()
    .setTitle("How many boxes would you like?")
    .setHelpText("Prices per box are confirmed on WhatsApp before the shipment.")
    .setRows(items)
    .setColumns(["0", "1", "2", "3", "4", "5", "6+"]);
  grid.setRequired(false);

  form.addMultipleChoiceItem().setTitle("Pickup location")
    .setChoiceValues(["2045 Carling Avenue, Ottawa (in the lobby)"]).setRequired(true);
  form.addMultipleChoiceItem().setTitle("Payment")
    .setChoiceValues(["Interac e-Transfer to siradeelahmedrahman@yahoo.ca"]).setRequired(true);
  form.addTextItem().setTitle("e-Transfer reference / name the payment is from (if already sent)");
  form.addParagraphTextItem().setTitle("Notes (special requests, gift message, etc.)");

  form.addCheckboxItem().setTitle("Confirmation")
    .setChoiceValues(["I understand my order is confirmed once the e-Transfer is received, and I'll pick up at the time shared on WhatsApp."])
    .setRequired(true);
  // This is what lets you message them about future shipments legally (CASL): only people who tick it.
  form.addMultipleChoiceItem().setTitle("Can Adeel message you on WhatsApp when the next shipment arrives?")
    .setChoiceValues(["Yes, message me about future shipments", "No thanks, just this order"]).setRequired(true);

  form.setRequireLogin(false);          // customers don't need a Google account
  form.setShowLinkToRespondAgain(true);
  form.setAcceptingResponses(true);
  form.setConfirmationMessage("JazakAllah khair! 🥭 Your order is in. Please send your Interac e-Transfer to siradeelahmedrahman@yahoo.ca. Adeel will confirm on WhatsApp (+1 613 408 3945). Tell a friend: https://pakistani.luxury/mangoes/");

  var sheet = SpreadsheetApp.create("Multani Mangoes orders");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // New Google Forms start "unpublished": publish it so anyone with the link can order
  var published = false;
  try { form.setPublished(true); published = form.isPublished(); } catch (e) {}
  Logger.log(published ? "PUBLISHED ✓ Customers can order now." : "Almost done: open the EDIT link below and press the purple 'Publish' button (top right).");
  Logger.log("SHARE this link with customers: " + form.getPublishedUrl());
  Logger.log("EDIT the form here: " + form.getEditUrl());
  Logger.log("ANSWERS go to this sheet: " + sheet.getUrl());
}
