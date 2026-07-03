import { createGamePackage, type PackForgeGamePackage, type TycoonGamePack } from "@packforge/core";
import { boutiqueHotelPack } from "./boutique-hotel";
import { coffeeShopPack } from "./coffee-shop";
import { deepenPack } from "./depth";
import { aquariumPack, farmMarketPack, movieStudioPack, themeParkPack } from "./extra-worlds";
import { festivalPack } from "./festival";
import { gameStudioPack } from "./game-studio";
import { scrapyardPack } from "./scrapyard";
import { spaceColonyPack } from "./space-colony";

export interface RegisteredGamePack {
  pack: TycoonGamePack;
  tagline: string;
}

const deepGameStudioPack = deepenPack(gameStudioPack);
const deepScrapyardPack = deepenPack(scrapyardPack);
const deepCoffeeShopPack = deepenPack(coffeeShopPack);
const deepSpaceColonyPack = deepenPack(spaceColonyPack);
const deepBoutiqueHotelPack = deepenPack(boutiqueHotelPack);
const deepFestivalPack = deepenPack(festivalPack);
const deepThemeParkPack = deepenPack(themeParkPack);
const deepFarmMarketPack = deepenPack(farmMarketPack);
const deepMovieStudioPack = deepenPack(movieStudioPack);
const deepAquariumPack = deepenPack(aquariumPack);

export const sampleGamePackage: PackForgeGamePackage = createGamePackage(
  {
    packageId: "packforge.samples",
    displayName: "PackForge Sample Games",
    version: "0.1.0",
    description: "Starter management tycoon game packs for PackForge.",
    author: "PackForge",
    tags: ["sample", "management", "tycoon"],
    entryPackId: gameStudioPack.id
  },
  [
    deepGameStudioPack,
    deepScrapyardPack,
    deepCoffeeShopPack,
    deepSpaceColonyPack,
    deepBoutiqueHotelPack,
    deepFestivalPack,
    deepThemeParkPack,
    deepFarmMarketPack,
    deepMovieStudioPack,
    deepAquariumPack
  ]
);

export const gamePackages: PackForgeGamePackage[] = [sampleGamePackage];

const packTagline = (packId: string) =>
  ({
    "game-studio": "Game Dev Tycoon style: ideas, builds, fans, contracts, and studio departments.",
    scrapyard: "Industrial management: stations, staff, contracts, and reclaimed materials.",
    "coffee-shop": "Cozy service tycoon: beans, drinks, pastries, local buzz, and regulars.",
    "space-colony": "Frontier infrastructure: power, water, oxygen, crops, research, and morale.",
    "boutique-hotel": "Hospitality management: rooms, service, comfort, events, reviews, and loyalty.",
    festival: "Event management: artists, stages, logistics, hype, tickets, and reputation.",
    "theme-park": "Park management: rides, safety, snacks, queues, guests, thrills, and reputation.",
    "farm-market": "Farm-to-market management: crops, preserves, stalls, deliveries, customers, and reputation.",
    "movie-studio": "Entertainment management: scripts, sets, footage, talent, edits, buzz, and premieres.",
    aquarium: "Public attraction management: habitats, water quality, exhibits, education, guests, and conservation."
  })[packId] ?? "A PackForge management tycoon game.";

export const gamePacks: RegisteredGamePack[] = sampleGamePackage.packs.map((pack) => ({
  pack,
  tagline: packTagline(pack.id)
}));

export const gamePackEntries: RegisteredGamePack[] = [
  {
    pack: deepGameStudioPack,
    tagline: packTagline(deepGameStudioPack.id)
  },
  {
    pack: deepScrapyardPack,
    tagline: packTagline(deepScrapyardPack.id)
  },
  {
    pack: deepCoffeeShopPack,
    tagline: packTagline(deepCoffeeShopPack.id)
  },
  {
    pack: deepSpaceColonyPack,
    tagline: packTagline(deepSpaceColonyPack.id)
  },
  {
    pack: deepBoutiqueHotelPack,
    tagline: packTagline(deepBoutiqueHotelPack.id)
  },
  {
    pack: deepFestivalPack,
    tagline: packTagline(deepFestivalPack.id)
  },
  {
    pack: deepThemeParkPack,
    tagline: packTagline(deepThemeParkPack.id)
  },
  {
    pack: deepFarmMarketPack,
    tagline: packTagline(deepFarmMarketPack.id)
  },
  {
    pack: deepMovieStudioPack,
    tagline: packTagline(deepMovieStudioPack.id)
  },
  {
    pack: deepAquariumPack,
    tagline: packTagline(deepAquariumPack.id)
  }
];

export const defaultGamePackId = deepGameStudioPack.id;

export const getGamePack = (packId: string) =>
  gamePacks.find((entry) => entry.pack.id === packId)?.pack ?? deepGameStudioPack;

export const getGamePackage = (packageId: string) =>
  gamePackages.find((entry) => entry.manifest.packageId === packageId) ?? sampleGamePackage;

export {
  aquariumPack,
  boutiqueHotelPack,
  coffeeShopPack,
  farmMarketPack,
  festivalPack,
  gameStudioPack,
  movieStudioPack,
  scrapyardPack,
  spaceColonyPack,
  themeParkPack
};
