import { QueryClient } from "@tanstack/react-query";
import { IHero } from "../types/hero";

export const queryClient = new QueryClient();

interface FetchHeroesParams {
  signal: AbortSignal;
  searchTerm?: string | null;
}

export async function getHeroes({ signal, searchTerm }: FetchHeroesParams) {
  let url =
    "https://raw.githubusercontent.com/odota/dotaconstants/master/build/heroes.json";

  if (!searchTerm) {
    url += "?search=" + searchTerm;
  }

  const response = await fetch(url, { signal });

  if (!response.ok) {
    const error: any = new Error("An error occurred while fetching heroes.");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const heroes = await response.json();

  return heroes;
}

export async function getHeroDetails(name: string) {
  const response = await fetch(
    "https://raw.githubusercontent.com/odota/dotaconstants/master/build/heroes.json"
  );

  if (!response.ok) {
    const error: Error & { code?: number; info?: any } = new Error(
      "An error occurred while fetching hero details."
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const heroes: IHero[] = await response.json();

  const newHero: IHero | undefined = Object.values(heroes).find(
    (heroName: IHero) => heroName.name.slice(14, heroName.name.length) === name
  );

  return newHero;
}

export async function getHeroLore(heroName: string) {
  const response = await fetch(
    "https://raw.githubusercontent.com/odota/dotaconstants/master/build/hero_lore.json"
  );

  if (!response.ok) {
    const error: any = new Error("An error occurred while fetching lore.");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const lores = await response.json();
  return lores[heroName];
}

export async function getHeroAbilities(name: string) {
  const response = await fetch(
    "https://raw.githubusercontent.com/odota/dotaconstants/master/build/hero_abilities.json"
  );

  if (!response.ok) {
    const error: any = new Error(
      "An error occurred while fetching hero abilities."
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const heroesAbilities = await response.json();

  if (!heroesAbilities[name]) {
    throw new Error(`Abilities for hero ${name} not found.`);
  }

  return heroesAbilities[name].abilities;
}

export async function getAbilities(heroAbilities: string[]) {
  const response = await fetch(
    "https://raw.githubusercontent.com/odota/dotaconstants/master/build/abilities.json"
  );

  if (!response.ok) {
    const error: any = new Error("An error occurred while fetching abilities.");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const allAbilities = await response.json();
  const filteredAbilities: any[] = [];

  for (let ability in allAbilities) {
    if (heroAbilities.includes(ability)) {
      filteredAbilities.push(allAbilities[ability]);
    }
  }

  return filteredAbilities;
}
