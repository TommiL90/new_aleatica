// types/ability.ts for casl

import {
  AbilityBuilder,
  type CreateAbility,
  createMongoAbility,
  type ForcedSubject,
  type MongoAbility,
} from "@casl/ability";
import type { User } from "next-auth";
import { PERMISSIONS } from "@/constants/permissions";

export const actions = ["read", "manage"] as const;
export const subjects = [
  "User",
  "Rol",
  "SimpleCatalog",
  "CompositeCatalog",
  "SimplePrice",
  "CompositePrice",
  "DeteriorationCatalog",
  "MRPerformanceIndicator",
  "PerformanceCatalog",
  "MtAccidentRoadSection",
  "MtActionCategory",
  "MtAdministration",
  "MtAxis",
  "MtBusinessUnit",
  "MtCalification",
  "MtCountry",
  "MtCurrencyUnit",
  "MtDeteriorationType",
  "MtDisposition",
  "MtFollowUp",
  "MtGeographicalArea",
  "MtHighwayIntersection",
  "MtHighwayLane",
  "MtPosition",
  "MtPriority",
  "MtProcessForm",
  "MtProjectCategory",
  "MonitoringUnit",
  "MtSide",
  "MtSlipLaneRoad",
  "MtSpecialtyAction",
  "MtStructureNumber",
  "MtSubCategoryAction",
  "MtSubspeciality",
  "MtTypology",
  "MtUnitOfMeasurement",
  "MtYear",
  "MtRoadSection",
  "MtStructureTypology",
  "PlanningAmountsPerformance",
  "PlanningTasksPerformance",
  "MeasurementTab",
  "Projects",
  "Resumenes",
  "ManualPerformanceCatalog",
  "Coefficient",
  "PLP",
  "ExchangeRate",
  "InflationRate",
  "Area",
  "Department",
  "GeneralAccountPlan",
  "OperatingExpense",
  "AreaUnidadNegocio",
  "DepartmentOperatingExpense",
  "OperatingExpenseSubOperatingExpense",
  "SubOperatingExpense",
  "SubCategoryOperatingExpense",
  "SubCategoryOperatingExpenseMudes",
  "MudesFamily",
  "FamilyGroup",
  "MaterialsGroup",
  "ProjectOp",
  "ProjectOpTask",
  "ProjectOpTaskDetail",
  "ProjectOpMaterial",
  "PersonalInventory",
  "InfrastructureInventory",
  "EquipmentInventory",
  "CeCoDescription",
  "CeCoPosition",
  "EndowmentMatrix",
  "EquipmentRepository",
  "PayrollPositionClassification",
  "RoadSafety",
  "SystemIts",
  "CivilWork",
  "MaterialsCatalog",
  "ConservationActivity",
  "CompositeWork",
  "all",
] as const;

// type AbilityConditions = {
//   href?: string
// }

export type AppAbilities = [
  (typeof actions)[number],
  (
    | (typeof subjects)[number]
    | ForcedSubject<Exclude<(typeof subjects)[number], "all">>
  ),
];

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export const defineAbilitiesFor = (user: User): AppAbility => {
  const { can, rules, build, cannot } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  if (user) {
    const permissionIds = user.permisoIds;
    permissionIds.forEach((permissionId: number) => {
      const permission = PERMISSIONS[permissionId];

      if (permission) {
        can(
          permission.action as (typeof actions)[number],
          permission.subject as (typeof subjects)[number]
        );
      }
    });
  } else {
    cannot("manage", "all");
  }

  return createMongoAbility(rules);
};
