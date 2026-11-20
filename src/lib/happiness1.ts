import Papa from "papaparse"

export async function getHappinessData() {
  const response = await fetch("/data/world_happiness_combined.csv")

  const csvText = await response.text()

  const result = Papa.parse(csvText, {
    header: true,
    delimiter: ";",
    dynamicTyping: true,
    skipEmptyLines: true,
  })

  return result.data
}
