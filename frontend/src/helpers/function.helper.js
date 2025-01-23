import jsPDF from "jspdf";

function nombreEnLettres(nombre) {
  if (nombre === 0) return "zéro";

  const moinsDeVingt = [
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
    "dix",
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize",
    "dix-sept",
    "dix-huit",
    "dix-neuf",
  ];
  const dizaines = [
    "",
    "dix",
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante-dix",
    "quatre-vingt",
    "quatre-vingt-dix",
  ];
  const grandsNombres = ["", "mille", "million", "milliard"];

  function helper(n) {
    if (n === 0) return "";
    else if (n < 20) return moinsDeVingt[n - 1];
    else if (n < 100) {
      const dix = Math.floor(n / 10);
      const reste = n % 10;

      if (dix === 7 || dix === 9) {
        return dizaines[dix - 1] + "-" + helper(reste + 10);
      }

      return dizaines[dix] + (reste ? "-" + helper(reste) : "");
    } else if (n < 1000) {
      const centaine = Math.floor(n / 100);
      const reste = n % 100;
      return (
        (centaine > 1 ? moinsDeVingt[centaine - 1] + " cent" : "cent") +
        (reste ? " " + helper(reste) : "")
      );
    }
  }

  let result = "";
  let i = 0;

  while (nombre > 0) {
    const groupe = nombre % 1000;

    if (groupe > 0) {
      const prefixe = helper(groupe);
      const suffixe = grandsNombres[i];
      if (i > 1 && groupe > 1) {
        result = prefixe + " " + suffixe + "s " + result;
      } else {
        result = prefixe + " " + suffixe + " " + result;
      }
    }

    nombre = Math.floor(nombre / 1000);
    i++;
  }

  return result.trim();
}

const prixEnLettres = (prix) => {
  try {
    const [dirhams, centimes] = prix.toFixed(2).split(".").map(Number);
    let resultat =
      nombreEnLettres(dirhams) + " dirham" + (dirhams > 1 ? "s" : "");
    if (centimes > 0) {
      resultat +=
        " et " +
        nombreEnLettres(centimes) +
        " centime" +
        (centimes > 1 ? "s" : "");
    }
    return resultat;
  } catch (error) {
    console.error("❌ Error while converting number to letters", error);
    return "";
  }
};

export const getAddress = (address) => {
  if (!address) return "";

  const { street, city, country } = address;

  if (!street && !city && !country) return "";

  let result = "";

  if (street) {
    result += `${street}`;
  }

  if (city) {
    result += `, ${city}`;
  }

  if (country) {
    result += `, ${country}`;
  }

  return result;
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const downloadInvoice = (event, invoice, client) => {
  try {
    event?.preventDefault();

    const doc = new jsPDF();

    doc.setFillColor(249, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, 10, 190, 58, 2, 2, "FD"); // FD = Fill and Draw

    // --- Invoice Title and Company Logo ---
    doc.setFontSize(24);
    doc.text("RGI Print", 17, 23); // Aligned with the image

    // --- Invoice Information (Right Aligned) ---
    doc.setFontSize(12);
    doc.setTextColor(143, 147, 167);
    doc.text(`Facture n°`, 193, 20, { align: "right" });
    doc.setTextColor(0, 0, 0);
    doc.text(`${invoice?.invoiceNumber || "22"}`, 193, 27, { align: "right" });

    doc.setTextColor(143, 147, 167);
    doc.text(`Date de facturation`, 193, 40, { align: "right" });
    doc.setTextColor(0, 0, 0);
    const date = formatDate(invoice?.date || Date.now());
    doc.text(date, 193, 47, { align: "right" });

    // --- Billing Details ---
    doc.setTextColor(143, 147, 167);
    doc.text("Facturé à", 17, 40);
    doc.setTextColor(0, 0, 0);
    doc.text(`${client?.customerName}`, 17, 47);

    const addressForm = getAddress(client?.address);
    doc.text(addressForm, 17, 54);
    doc.text(`ICE: ${client?.ICE}`, 17, addressForm ? 61 : 54);

    // --- Table Headers (Light Gray Background) ---
    const tableHeaderY = 80;

    doc.setDrawColor(229, 231, 235); // Light gray (e5e7eb)
    doc.setLineWidth(0.2); // 0.2 units for 1px equivalent in jsPDF
    doc.line(10, tableHeaderY + 10, 200, tableHeaderY + 10); // Draw the bottom border line

    // Set text color and add text
    doc.setTextColor(0, 0, 0); // Black text
    doc.text("Description", 10, tableHeaderY + 6);
    doc.text("Quantité", 95, tableHeaderY + 6);
    doc.text("Prix Unitaire", 125, tableHeaderY + 6);
    doc.text("Total", 200, tableHeaderY + 6, { align: "right" });

    // --- Table Items ---
    let tableY = tableHeaderY + 18;
    invoice?.items.forEach((item) => {
      doc.text(item.description || "Description", 10, tableY);
      doc.text(String(item.quantity || 0), 95, tableY);
      doc.text(`${Number(item.price)?.toFixed(2)}`, 125, tableY);
      const price = Number(item.quantity) * Number(item.price);
      doc.text(`${Number(price)?.toFixed(2)}`, 200, tableY, { align: "right" });
      tableY += 10;
    });

    doc.line(10, tableY, 200, tableY); // Draw the bottom border line
    tableY += 10;

    // --- Summary Section ---
    doc.setFontSize(12);

    const totalHt =
      invoice?.items
        .reduce((sum, item) => sum + item.quantity * item.price, 0)
        ?.toFixed(2) || 0.0;
    const totalTva = (totalHt * 0.2)?.toFixed(2) || 0.0;
    const totalTtc = (totalHt * 1.2)?.toFixed(2) || 0.0;
    const totalEnLettres = prixEnLettres(Number(totalTtc));

    doc.setTextColor(143, 147, 167);
    doc.text("Montant HT", 10, tableY + 10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${totalHt}DH`, 200, tableY + 10, { align: "right" });

    doc.setTextColor(143, 147, 167);
    doc.text("TVA (20%)", 10, tableY + 17);
    doc.setTextColor(0, 0, 0);
    doc.text(`${totalTva}DH`, 200, tableY + 17, { align: "right" });

    doc.line(10, tableY + 29, 140, tableY + 29);

    doc.setFillColor(249, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2); // 0.2 units for 1px equivalent in jsPDF

    doc.roundedRect(120, tableY + 24, 80, 10, 2, 2, "FD");

    doc.setTextColor(143, 147, 167);
    doc.text("Montant TTC", 125, tableY + 30.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`${totalTtc}DH`, 195, tableY + 30.5, { align: "right" });

    doc.text(totalEnLettres, 200, tableY + 40, { align: "right" });

    // --- Footer Notes ---
    const footerY = 262; // Place footer at the bottom

    doc.setFillColor(249, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, footerY - 4, 190, 29, 2, 2, "FD"); // FD = Fill and Draw

    doc.setFontSize(10);
    doc.text(
      "Sté RGI Print SARL - Réalisation & Impression",
      105,
      footerY + 4,
      {
        align: "center",
      }
    );
    doc.text(
      "10, Rue Liberté appt 5 3e étage - Casablanca - Tél: 06 10 808 374 - Email: rgiprintz@gmail.com",
      105,
      footerY + 9,
      { align: "center" }
    );
    doc.text(
      "RC n°: 638905 - Patente n°: 3421129 - ICE: 003538988000084 - IF: 6604481",
      105,
      footerY + 14,
      { align: "center" }
    );
    doc.text(
      "Compte Bancaire Crédit du Maroc: 021 780 000023830047086 63",
      105,
      footerY + 19,
      { align: "center" }
    );

    // --- Save PDF ---
    doc.save(`facture_${invoice?.invoiceNumber || "exemple"}.pdf`);
  } catch (error) {
    console.error("❌ Error saving invoice:", error);
  }
};
