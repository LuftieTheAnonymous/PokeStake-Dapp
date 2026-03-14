export type Currency = "ETH" | "SNORLIE";

export interface NFTItem {
  id: string;
  name: string;
  collection: string;
  image: string;
  price: number;
  currency: Currency;
  creator: string;
  listedAt: Date;
}

export const mockNFTs: NFTItem[] = [
  {
    id: "1",
    name: "Inferno Drake #042",
    collection: "Elemental Beasts",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 1.24,
    currency: "ETH",
    creator: "0x1a2b...3c4d",
    listedAt: new Date("2026-03-10"),
  },
  {
    id: "2",
    name: "Aqua Serpent #118",
    collection: "Elemental Beasts",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 450,
    currency: "SNORLIE",
    creator: "0x5e6f...7g8h",
    listedAt: new Date("2026-03-12"),
  },
  {
    id: "3",
    name: "Volt Fox #007",
    collection: "Spark Companions",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 0.85,
    currency: "ETH",
    creator: "0x9i0j...1k2l",
    listedAt: new Date("2026-03-13"),
  },
  {
    id: "4",
    name: "Terra Shell #203",
    collection: "Garden Guardians",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 1200,
    currency: "SNORLIE",
    creator: "0x3m4n...5o6p",
    listedAt: new Date("2026-03-11"),
  },
  {
    id: "5",
    name: "Shadow Fang #066",
    collection: "Night Prowlers",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 2.1,
    currency: "ETH",
    creator: "0x7q8r...9s0t",
    listedAt: new Date("2026-03-09"),
  },
  {
    id: "6",
    name: "Frost Wing #155",
    collection: "Elemental Beasts",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 780,
    currency: "SNORLIE",
    creator: "0xu1v2...w3x4",
    listedAt: new Date("2026-03-14"),
  },
  {
    id: "7",
    name: "Inferno Drake #099",
    collection: "Elemental Beasts",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 3.5,
    currency: "ETH",
    creator: "0x1a2b...3c4d",
    listedAt: new Date("2026-03-08"),
  },
  {
    id: "8",
    name: "Aqua Serpent #200",
    collection: "Elemental Beasts",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 320,
    currency: "SNORLIE",
    creator: "0x5e6f...7g8h",
    listedAt: new Date("2026-03-07"),
  },
  {
    id: "9",
    name: "Volt Fox #033",
    collection: "Spark Companions",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
    price: 0.42,
    currency: "ETH",
    creator: "0x9i0j...1k2l",
    listedAt: new Date("2026-03-06"),
  },
];