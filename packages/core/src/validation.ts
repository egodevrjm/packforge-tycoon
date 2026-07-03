import type { TycoonGamePack } from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

const collectDuplicateIds = (kind: string, ids: string[]) => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    }
    seen.add(id);
  }
  return [...duplicates].map((id) => `${kind} id "${id}" is duplicated.`);
};

export const validateGamePack = (pack: TycoonGamePack): ValidationResult => {
  const errors: string[] = [];
  const resourceIds = new Set(pack.resources.map((resource) => resource.id));
  const recipeIds = new Set(pack.recipes.map((recipe) => recipe.id));
  const buildingIds = new Set(pack.buildings.map((building) => building.id));
  const contractIds = new Set(pack.contracts.map((contract) => contract.id));
  const upgradeIds = new Set(pack.upgrades.map((upgrade) => upgrade.id));
  const actionIds = new Set((pack.actions ?? []).map((action) => action.id));
  const eraIds = new Set((pack.eras ?? []).map((era) => era.id));
  const projectIds = new Set((pack.projects ?? []).map((project) => project.id));
  const marketIds = new Set((pack.markets ?? []).map((market) => market.id));
  const trendIds = new Set((pack.marketTrends ?? []).map((trend) => trend.id));
  const eventIds = new Set((pack.events ?? []).map((event) => event.id));
  const eventDeckIds = new Set((pack.eventDecks ?? []).map((deck) => deck.id));
  const staffRoleIds = new Set((pack.staffRoles ?? []).map((role) => role.id));
  const staffTraitIds = new Set((pack.staffTraits ?? []).map((trait) => trait.id));
  const categories = new Set(pack.buildings.map((building) => building.category));
  const allUnlockableIds = new Set([
    ...buildingIds,
    ...contractIds,
    ...upgradeIds,
    ...actionIds,
    ...eraIds,
    ...projectIds,
    ...trendIds,
    ...eventIds,
    ...resourceIds
  ]);

  errors.push(
    ...collectDuplicateIds("Resource", pack.resources.map((resource) => resource.id)),
    ...collectDuplicateIds("Recipe", pack.recipes.map((recipe) => recipe.id)),
    ...collectDuplicateIds("Building", pack.buildings.map((building) => building.id)),
    ...collectDuplicateIds("Contract", pack.contracts.map((contract) => contract.id)),
    ...collectDuplicateIds("Upgrade", pack.upgrades.map((upgrade) => upgrade.id)),
    ...collectDuplicateIds("Action", (pack.actions ?? []).map((action) => action.id)),
    ...collectDuplicateIds("Era", (pack.eras ?? []).map((era) => era.id)),
    ...collectDuplicateIds("Project", (pack.projects ?? []).map((project) => project.id)),
    ...collectDuplicateIds("Market", (pack.markets ?? []).map((market) => market.id)),
    ...collectDuplicateIds("Market trend", (pack.marketTrends ?? []).map((trend) => trend.id)),
    ...collectDuplicateIds("Event", (pack.events ?? []).map((event) => event.id)),
    ...collectDuplicateIds("Event deck", (pack.eventDecks ?? []).map((deck) => deck.id)),
    ...collectDuplicateIds("Staff role", (pack.staffRoles ?? []).map((role) => role.id)),
    ...collectDuplicateIds("Staff trait", (pack.staffTraits ?? []).map((trait) => trait.id)),
    ...collectDuplicateIds("Staff candidate", (pack.staffCandidates ?? []).map((candidate) => candidate.id))
  );

  for (const recipe of pack.recipes) {
    for (const resourceId of [...Object.keys(recipe.inputs), ...Object.keys(recipe.outputs)]) {
      if (!resourceIds.has(resourceId)) {
        errors.push(`Recipe "${recipe.id}" references unknown resource "${resourceId}".`);
      }
    }
    if (recipe.durationMs <= 0) {
      errors.push(`Recipe "${recipe.id}" must have a positive duration.`);
    }
  }

  for (const building of pack.buildings) {
    if (building.recipeId && !recipeIds.has(building.recipeId)) {
      errors.push(`Building "${building.id}" references unknown recipe "${building.recipeId}".`);
    }
    if (building.size.width <= 0 || building.size.height <= 0) {
      errors.push(`Building "${building.id}" must have a positive size.`);
    }
  }

  for (const contract of pack.contracts) {
    for (const resourceId of Object.keys(contract.requires)) {
      if (!resourceIds.has(resourceId)) {
        errors.push(`Contract "${contract.id}" requires unknown resource "${resourceId}".`);
      }
    }
    for (const unlockId of contract.unlockIds) {
      if (!allUnlockableIds.has(unlockId)) {
        errors.push(`Contract "${contract.id}" unlocks unknown id "${unlockId}".`);
      }
    }
  }

  for (const upgrade of pack.upgrades) {
    for (const unlockId of upgrade.effect.unlockIds ?? []) {
      if (!allUnlockableIds.has(unlockId)) {
        errors.push(`Upgrade "${upgrade.id}" unlocks unknown id "${unlockId}".`);
      }
    }
  }

  for (const action of pack.actions ?? []) {
    if (action.cooldownMs < 0) {
      errors.push(`Action "${action.id}" must not have a negative cooldown.`);
    }
    for (const unlockId of action.unlockIds ?? []) {
      if (!allUnlockableIds.has(unlockId)) {
        errors.push(`Action "${action.id}" unlocks unknown id "${unlockId}".`);
      }
    }
    for (const resourceId of [
      ...Object.keys(action.costResources ?? {}),
      ...Object.keys(action.effect.resources ?? {})
    ]) {
      if (!resourceIds.has(resourceId)) {
        errors.push(`Action "${action.id}" references unknown resource "${resourceId}".`);
      }
    }
    const boostCategory = action.effect.productionBoost?.category;
    if (boostCategory && !pack.buildings.some((building) => building.category === boostCategory)) {
      errors.push(`Action "${action.id}" boosts unknown category "${boostCategory}".`);
    }
  }

  for (const era of pack.eras ?? []) {
    for (const resourceId of Object.keys(era.requires?.resources ?? {})) {
      if (!resourceIds.has(resourceId)) {
        errors.push(`Era "${era.id}" requires unknown resource "${resourceId}".`);
      }
    }
    for (const unlockId of era.requires?.unlockedIds ?? []) {
      if (!allUnlockableIds.has(unlockId)) {
        errors.push(`Era "${era.id}" requires unknown unlock "${unlockId}".`);
      }
    }
    for (const unlockId of era.unlockIds ?? []) {
      if (!allUnlockableIds.has(unlockId)) {
        errors.push(`Era "${era.id}" unlocks unknown id "${unlockId}".`);
      }
    }
  }

  for (const market of pack.markets ?? []) {
    if (market.demand <= 0) {
      errors.push(`Market "${market.id}" must have positive demand.`);
    }
  }

  for (const trend of pack.marketTrends ?? []) {
    if (trend.startsAtMs < 0) {
      errors.push(`Market trend "${trend.id}" must not start before time zero.`);
    }
    if (trend.durationMs <= 0) {
      errors.push(`Market trend "${trend.id}" must have a positive duration.`);
    }
    if (trend.marketId && !marketIds.has(trend.marketId)) {
      errors.push(`Market trend "${trend.id}" references unknown market "${trend.marketId}".`);
    }
    if (trend.category && !categories.has(trend.category)) {
      errors.push(`Market trend "${trend.id}" references unknown category "${trend.category}".`);
    }
    for (const resourceId of Object.keys(trend.resourceDemand ?? {})) {
      if (!resourceIds.has(resourceId)) {
        errors.push(`Market trend "${trend.id}" references unknown resource "${resourceId}".`);
      }
    }
  }

  for (const project of pack.projects ?? []) {
    if (project.phases.length === 0) {
      errors.push(`Project "${project.id}" must include at least one phase.`);
    }
    if (project.marketId && !marketIds.has(project.marketId)) {
      errors.push(`Project "${project.id}" references unknown market "${project.marketId}".`);
    }
    for (const resourceId of Object.keys(project.requiredResources ?? {})) {
      if (!resourceIds.has(resourceId)) {
        errors.push(`Project "${project.id}" requires unknown resource "${resourceId}".`);
      }
    }
    for (const unlockId of project.unlockIds ?? []) {
      if (!allUnlockableIds.has(unlockId)) {
        errors.push(`Project "${project.id}" unlocks unknown id "${unlockId}".`);
      }
    }
    for (const phase of project.phases) {
      if (phase.durationMs <= 0) {
        errors.push(`Project "${project.id}" phase "${phase.id}" must have a positive duration.`);
      }
      for (const resourceId of Object.keys(phase.qualityFromResources ?? {})) {
        if (!resourceIds.has(resourceId)) {
          errors.push(`Project "${project.id}" phase "${phase.id}" references unknown resource "${resourceId}".`);
        }
      }
    }
  }

  for (const event of pack.events ?? []) {
    if (event.choices.length === 0) {
      errors.push(`Event "${event.id}" must include at least one choice.`);
    }
    if (event.trigger.unlockedId && !allUnlockableIds.has(event.trigger.unlockedId)) {
      errors.push(`Event "${event.id}" listens for unknown unlock "${event.trigger.unlockedId}".`);
    }
    if (event.deckId && !eventDeckIds.has(event.deckId)) {
      errors.push(`Event "${event.id}" references unknown deck "${event.deckId}".`);
    }
    if (event.trigger.eraId && !eraIds.has(event.trigger.eraId)) {
      errors.push(`Event "${event.id}" listens for unknown era "${event.trigger.eraId}".`);
    }
    if (event.trigger.trendId && !trendIds.has(event.trigger.trendId)) {
      errors.push(`Event "${event.id}" listens for unknown trend "${event.trigger.trendId}".`);
    }
    for (const choice of event.choices) {
      for (const resourceId of Object.keys(choice.effect.resources ?? {})) {
        if (!resourceIds.has(resourceId)) {
          errors.push(`Event "${event.id}" choice "${choice.id}" references unknown resource "${resourceId}".`);
        }
      }
      for (const unlockId of choice.effect.unlockIds ?? []) {
        if (!allUnlockableIds.has(unlockId)) {
          errors.push(`Event "${event.id}" choice "${choice.id}" unlocks unknown id "${unlockId}".`);
        }
      }
    }
  }

  for (const deck of pack.eventDecks ?? []) {
    if (deck.intervalMs <= 0) {
      errors.push(`Event deck "${deck.id}" must have a positive interval.`);
    }
    for (const eventId of deck.eventIds) {
      if (!eventIds.has(eventId)) {
        errors.push(`Event deck "${deck.id}" references unknown event "${eventId}".`);
      }
    }
  }

  for (const trait of pack.staffTraits ?? []) {
    if (trait.category && !categories.has(trait.category)) {
      errors.push(`Staff trait "${trait.id}" references unknown category "${trait.category}".`);
    }
  }

  for (const role of pack.staffRoles ?? []) {
    if (!categories.has(role.category)) {
      errors.push(`Staff role "${role.id}" references unknown category "${role.category}".`);
    }
    if (role.baseWage < 0) {
      errors.push(`Staff role "${role.id}" must not have a negative wage.`);
    }
  }

  for (const candidate of pack.staffCandidates ?? []) {
    if (!staffRoleIds.has(candidate.roleId)) {
      errors.push(`Staff candidate "${candidate.id}" references unknown role "${candidate.roleId}".`);
    }
    if (candidate.hireCost < 0) {
      errors.push(`Staff candidate "${candidate.id}" must not have a negative hire cost.`);
    }
    if (candidate.level <= 0) {
      errors.push(`Staff candidate "${candidate.id}" must have a positive level.`);
    }
    for (const traitId of candidate.traits) {
      if (staffTraitIds.size > 0 && !staffTraitIds.has(traitId)) {
        errors.push(`Staff candidate "${candidate.id}" references unknown trait "${traitId}".`);
      }
    }
  }

  for (const resourceId of Object.keys(pack.startingState.resources)) {
    if (!resourceIds.has(resourceId)) {
      errors.push(`Starting state references unknown resource "${resourceId}".`);
    }
  }

  for (const unlockId of pack.startingState.unlockedIds) {
    if (!allUnlockableIds.has(unlockId)) {
      errors.push(`Starting state unlocks unknown id "${unlockId}".`);
    }
  }

  const reachableResources = new Set(Object.keys(pack.startingState.resources));
  for (const action of pack.actions ?? []) {
    for (const resourceId of Object.keys(action.effect.resources ?? {})) {
      reachableResources.add(resourceId);
    }
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const recipe of pack.recipes) {
      const canProduce = Object.keys(recipe.inputs).every((resourceId) => reachableResources.has(resourceId));
      if (!canProduce) {
        continue;
      }
      for (const resourceId of Object.keys(recipe.outputs)) {
        if (!reachableResources.has(resourceId)) {
          reachableResources.add(resourceId);
          changed = true;
        }
      }
    }
  }
  for (const contract of pack.contracts) {
    for (const resourceId of Object.keys(contract.requires)) {
      if (resourceIds.has(resourceId) && !reachableResources.has(resourceId)) {
        errors.push(`Contract "${contract.id}" requires unreachable resource "${resourceId}".`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
};
