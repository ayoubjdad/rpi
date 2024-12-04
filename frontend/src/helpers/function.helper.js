function nombreEnLettres(nombre) {
  const unites = [
    "",
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
  ];
  const dizaines = [
    "",
    "dix",
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante",
    "quatre-vingt",
    "quatre-vingt",
  ];
  const special = [
    "dix",
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize",
  ];

  function convertirEnLettres(n) {
    if (n === 0) return "zéro";
    if (n < 10) return unites[n];
    if (n < 17) return special[n - 10];
    if (n < 20) return "dix-" + unites[n - 10];
    if (n < 70) {
      let base = dizaines[Math.floor(n / 10)];
      let reste = n % 10;
      return base + (reste === 1 ? "-et-" : reste ? "-" : "") + unites[reste];
    }
    if (n < 80) return "soixante-" + convertirEnLettres(n - 60);
    if (n < 100)
      return (
        "quatre-vingt" + (n % 10 === 0 ? "" : "-" + convertirEnLettres(n - 80))
      );
    if (n < 1000) {
      let centaine = Math.floor(n / 100);
      let reste = n % 100;
      return (
        (centaine > 1 ? unites[centaine] + "-" : "") +
        "cent" +
        (reste > 0 ? "-" + convertirEnLettres(reste) : "")
      );
    }
    throw new Error("Number too large");
  }

  return convertirEnLettres(nombre);
}

export function prixEnLettres(prix) {
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
}
