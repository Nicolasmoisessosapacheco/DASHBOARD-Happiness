const felices = data.filter(
  row => parseFloat(row["Happiness score"]?.replace(",", ".")) >= 5
).length;

const tristes = data.filter(
  row => parseFloat(row["Happiness score"]?.replace(",", ".")) < 5
).length;

const balancePaises =
  felices > tristes ? "Más felices" :
  tristes > felices ? "Más tristes" :
  "Empate";

