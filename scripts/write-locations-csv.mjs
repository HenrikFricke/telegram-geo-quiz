import fetch from "node-fetch";
import path from "path";
import csvWrite from "csv-writer";
import uuid from "uuid";

(async () => {
  const continentMapping = {
    AF: "africa",
    NA: "north america",
    OC: "oceania",
    AN: "antarctica",
    AS: "asia",
    EU: "europe",
    SA: "south america"
  };

  const csv = csvWrite.createObjectCsvWriter({
    path: path.resolve("data/locations.csv"),
    alwaysQuote: true,
    header: [
      { id: "id", title: "id (S)" },
      { id: "location", title: "location (S)" },
      { id: "isCapital", title: "isCapital (BOOL)" }
    ]
  });

  const [continents, countries, capitals] = await Promise.all([
    fetch("http://country.io/continent.json").then(r => r.json()),
    fetch("http://country.io/names.json").then(r => r.json()),
    fetch("http://country.io/capital.json").then(r => r.json())
  ]);

  const data = Object.keys(countries).map(c => {
    const country = countries[c].toLowerCase();
    const capital = capitals[c].toLowerCase();
    const continent = continentMapping[continents[c]];

    return {
      id: uuid.v4(),
      location: `city#earth#${continent}#${country}#${capital}`,
      isCapital: true
    };
  });

  await csv.writeRecords(data);
})();
