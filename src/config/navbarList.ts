import type { AppAbilities, AppAbility } from "@/lib/permissions/ability";

export interface NavBarThirdSubItem {
  title: string;
  description: string;
  href: string;
  permission?: AppAbilities;
}

export interface NavBarSecondSubItem {
  title: string;
  description: string;
  href?: string;
  thirdSubItems?: NavBarThirdSubItem[];
  permission?: AppAbilities;
}

export interface NavBarFirstSubItem {
  title: string;
  description: string;
  href?: string;
  secondSubItems?: NavBarSecondSubItem[];
  permission?: AppAbilities;
}

export interface NavbarItem {
  title: string;
  href?: string;
  firstSubItems?: NavBarFirstSubItem[];
  permission?: AppAbilities;
}

export const navbarList: NavbarItem[] = [
  {
    title: "Panel",
    href: "/dashboard",
    permission: ["read", "User"],
  },
  {
    title: "Datos Generales",
    // 1. Datos generales
    firstSubItems: [
      // {
      //   title: 'Tanstack',
      //   description: 'Test tanstack',
      //   // Submenú 1.1.1 permiso por submenú
      //   permission: ['read', 'MtBusinessUnit'],
      //   secondSubItems: [
      //     {
      //       title: 'Mediciones Pavimentos',
      //       description: 'Ejemplo de componente spreadsheet nuevo',
      //       href: '/tanstack/example1/mediciones/pavimentos',
      //     },

      //     {
      //       title: 'Mediciones Estructuras',
      //       description: 'Ejemplo de componente spreadsheet nuevo',
      //       href: '/tanstack/example1/mediciones/estructuras',
      //     },

      //     {
      //       title: 'Mediciones Safety',
      //       description: 'Ejemplo de componente spreadsheet nuevo',
      //       href: '/tanstack/example1/mediciones/safety',
      //     },

      //     {
      //       title: 'Mediciones Safety - Horizontal',
      //       description: 'Ejemplo de componente spreadsheet nuevo',
      //       href: '/tanstack/example1/mediciones/safety-horizontal',
      //     },

      //     {
      //       title: 'Mediciones Safety - Vertical',
      //       description: 'Ejemplo de componente spreadsheet nuevo',
      //       href: '/tanstack/example1/mediciones/safety-vertical',
      //     },
      //   ],
      // },
      {
        title: "Ud. Negocio",
        description: "Información de unidad de negocios",
        // Submenú 1.1.1 permiso por submenú
        permission: ["read", "MtBusinessUnit"],
        secondSubItems: [
          {
            title: "Mtro Ud Neg",
            description: "Informacion de unidad de negocios",
            thirdSubItems: [
              {
                title: "Ud. Neg.",
                description: "Repositorio de unidad de negocios",
                href: "/maestros/unidades_negocios",
              },
              {
                title: "Indic. MR",
                description: "Breve texto introductorio del menú",
                // Estos indicadores son visualizados por los Especialistas
                href: "/maestros/desempeno",
              },
              {
                title: "País",
                description: "Breve texto introductorio del menú",
                href: "/zonas_geograficas/pais",
              },
              {
                title: "Zonas Geog.",
                description: "Breve texto introductorio del menú",
                href: "/zonas_geograficas/zonas",
              },
              {
                title: "Admin. Comp.",
                description: "Breve texto introductorio del menú",
                href: "/zonas_geograficas/administracion",
              },
              {
                title: "Áreas Ud.",
                description: "Areas de la unidad de negocios",
                href: "/operaciones/areas_unidad_negocio",
              },
            ],
          },
          {
            title: "Inv. Tramos",
            description: "Datos de inventarios de tramos",
            // Submenú 1.1.2 permiso por submenú
            permission: ["read", "MtHighwayIntersection"],
            thirdSubItems: [
              {
                title: "Inv. Tramos",
                description: "Inventario de tramos",
                href: "/elementos_carretera/tramos",
              },
              {
                title: "Inv Entronq",
                description: "Inventario de entronques",
                href: "/elementos_carretera/entronque",
              },
              {
                title: "Inv. Gaza",
                description: "Inventario de gazas / cuerpos",
                href: "/elementos_carretera/gaza",
              },
              {
                title: "Inv. Carril",
                description: "Inventario de carriles",
                href: "/elementos_carretera/carril",
              },
            ],
          },
          {
            title: "TCA",
            description: "Tramos de concentracion de accidentes",
            // Submenú 1.1.3. Sin subítem, puede heredar del anterior
            permission: ["read", "MtAccidentRoadSection"],
            thirdSubItems: [
              {
                title: "Cat. TCA",
                description: "Inventario de TCAs",
                href: "/elementos_carretera/tca",
              },
            ],
          },
          {
            title: "Plan/Mat.",
            description: "Plan de Cuentas y Grupo de Materiales",
            permission: ["read", "GeneralAccountPlan"],
            thirdSubItems: [
              {
                title: "Plan Cta My",
                description: "Plan de Cuenta Mayor",
                href: "/operaciones/plan_cuenta_mayor",
              },
              {
                title: "Gpo. Mater.",
                description: "Grupo de Materiales",
                href: "/operaciones/grupo_materiales",
              },
              {
                title: "Gpo. Fam.",
                description: "Grupo de Familia",
                href: "/operaciones/grupo_familia",
              },
            ],
          },
          {
            title: "MUDE",
            description: "Formularios MUDE",
            permission: ["read", "OperatingExpense"],
            thirdSubItems: [
              {
                title: "M1: Áreas",
                description: "Mude 1: Áreas Operativas",
                href: "/operaciones/mude/areas_operativas",
              },
              {
                title: "M2: Dir. G.",
                description: "Mude 2: Dirección de Gastos",
                href: "/operaciones/mude/direccion_gastos",
              },
              {
                title: "M3: Gastos",
                description: "Mude 3: Concepto de Gastos Operacionales",
                href: "/operaciones/mude/concepto_gastos_operacionales",
              },
              {
                title: "M2+3: Depto",
                description: "Mude 2+3: Departamento / Gastos Operacionales",
                href: "/operaciones/mude/departamento_gastos_operacionales",
              },
              {
                title: "M4: Serv.",
                description: "Mude 4: Servicios Subcontratados",
                href: "/operaciones/mude/servicios_subcontratados",
              },
              {
                title:
                  "Mude 2+3+4: Gastos Operacionales / Servicios Subcontratados",
                description:
                  "Mude 2+3+4: Gastos Operacionales / Servicios Subcontratados",
                href: "/operaciones/mude/gastos_operacionales_servicios_subcontratados",
              },
              {
                title: "M5: Subcat.",
                description: "Mude 5: Subcategoría de Gastos Operacionales",
                href: "/operaciones/mude/subcategoria_gastos_operacionales",
              },
              {
                title:
                  "Mude 2+3+4+5: Servicios Subcontratados / Subcategoría de Gastos Operacionales",
                description:
                  "Mude 2+3+4+5: Servicios Subcontratados / Subcategoría de Gastos Operacionales",
                href: "/operaciones/mude/servicios_subcontratados_subcategoria_gastos_operacionales",
              },
              {
                title: "MUDE Fam.",
                description:
                  "MUDE con Familia de Grupo de Materiales o Servicios",
                href: "/operaciones/mude/mude_grupo_familia",
              },
            ],
          },
          {
            title: "Inv. Pers.",
            description: "Inventario de Personal",
            permission: ["read", "PersonalInventory"],
            thirdSubItems: [
              {
                title: "Desc. CeCo",
                description: "CeCo",
                href: "/operaciones/descripcion_por_centro_costo",
              },
              {
                title: "Tipo Pos.",
                description: "CeCo",
                href: "/operaciones/tipo_posicion_por_centro_costo",
              },
              {
                title: "Clas. Carg.",
                description: "Clasificación de Cargos de Nómina",
                href: "/operaciones/clasificacion_cargos_nomina",
              },
              {
                title: "Matriz Dot.",
                description: "Matriz de Dotación de Personal",
                href: "/operaciones/matriz_dotacion_personal",
              },
            ],
          },
          {
            title: "Rep. Eq/Maq",
            description: "Repositorio de Equipos y Maquinarias",
            permission: ["read", "EquipmentRepository"],
            href: "/operaciones/repositorio_equipos",
          },
        ],
      },
      {
        title: "Identif.",
        description: "Principales indicadores del sistema",
        permission: ["read", "MtProjectCategory"],
        // Submenú 1.2 Permisos generales al submenú
        secondSubItems: [
          {
            title: "Form. Proc.",
            description: "Repositorio de formularios de procesos",
            // Subítem sin Submenú 1.2.1
            href: "/identificadores/formularios",
          },
          {
            title: "Def. Act.",
            description: "subgrupo de actuaciones",
            // Submenú 1.2.2
            thirdSubItems: [
              {
                title: "Cat. Proy.",
                description: "Repositorio de categorías del Proyecto",
                href: "/identificadores/definicion_actuaciones/categorias_proyecto",
              },
              {
                title: "Cat. Act.",
                description: "Repositorio de categorías de actuación",
                href: "/identificadores/definicion_actuaciones/categorias_actuacion",
              },
              {
                title: "Subcat Act",
                description: "Repositorio de subcategorías de actuación",
                href: "/identificadores/definicion_actuaciones/subcategorias_actuacion",
              },
              {
                title: "Espec. Act.",
                description: "Repositorio de especialidades de actuación",
                href: "/identificadores/definicion_actuaciones/especialidades_actuacion",
              },
              {
                title: "Fase/Part.",
                description: "Repositorio de fase/partidas",
                href: "/identificadores/definicion_actuaciones/departures",
              },
            ],
          },
          {
            title: "Unidades",
            description: "subgrupo de unidades",
            // Submenú 1.2.3
            thirdSubItems: [
              {
                title: "Ud. Seguim.",
                description: "Repositorio de unidades de seguimiento",
                href: "/identificadores/unidades/unidades_seguimiento",
              },
              {
                title: "Ud. Medic.",
                description: "Repositorio de unidades de obra",
                href: "/identificadores/unidades/unidad_obra",
              },
              {
                title: "Tipos Mon.",
                description: "Tipos de monedas",
                href: "/identificadores/unidades/moneda",
              },
            ],
          },
          {
            title: "Det. Elem.",
            description: "Detalle de elementos de inventario",
            // Submenú 1.2.4, es posible que se le concedan permisos a Especialistas
            thirdSubItems: [
              {
                title: "Posición",
                description: "Repositorio de posiciones",
                href: "/identificadores/detalles/posicion",
              },
              {
                title: "Disp. Def.",
                description: "Repositorio de disposiciones",
                href: "/identificadores/detalles/disposicion",
              },
              {
                title: "Tipología",
                description: "Repositorio de tipologías",
                href: "/identificadores/detalles/tipologia",
              },
              {
                title: "Tipo Elem.",
                description: "Repositorio de tipologías",
                href: "/identificadores/detalles/tipo_elemento_estructura",
              },
            ],
          },
          {
            title: "Prior. Int.",
            description: "Repositorio de prioridades",
            href: "/identificadores/prioridad",
          },
        ],
      },
      {
        title: "Datos Econ.",
        description: "Principales indicadores económicos",
        // Submenú 1.3
        permission: ["read", "Projects"],
        secondSubItems: [
          {
            title: "Tasas Cam.",
            description: "Repositorio de tasas de cambios",
            href: "/datos_economicos/tasaCambio",
          },
          {
            title: "Tasa Infl.",
            description: "Repositorio de tasas de cambios",
            href: "/datos_economicos/tasaInflacion",
          },
        ],
      },
    ],
  },
  {
    title: "Presupuestos",
    permission: ["read", "Projects"],
    firstSubItems: [
      {
        title: "Mant. Mayor",
        description: "Presupuestos de Mantenimiento Mayor",
        secondSubItems: [
          {
            title: "Nuevo Pres.",
            description: "Crea nuevo presupuesto",
            href: "/proyectos/nuevo",
          },
          {
            title: "Lista Pres.",
            description: "Listado de presupuestos en desarrollo",
            href: "/proyectos",
          },
        ],
      },
      {
        title: "Operaciones",
        description: "Presupuestos de Operaciones",
        permission: ["read", "ProjectOp"],
        secondSubItems: [
          {
            title: "Nuevo Pres.",
            description: "Crea nuevo presupuesto",
            href: "/operaciones/proyectos/nuevo",
          },
          {
            title: "Lista Pres.",
            description: "Listado de presupuestos en desarrollo",
            href: "/operaciones/proyectos",
          },
        ],
      },
    ],
  },
  {
    title: "Catálogos Globales",
    firstSubItems: [
      {
        title: "Mant. Mayor",
        description: "Catálogo de presupuesto de mantenimiento mayor",
        secondSubItems: [
          {
            title: "Deterioros",
            description: "Breve texto introductorio del menú",
            permission: ["read", "MtDeteriorationType"],
            href: "/catalogos/deterioros",
          },
          {
            title: "Subud Simp",
            description: "Repositorio de subunidades simples",
            permission: ["read", "MtSubspeciality"],
            href: "/catalogos/subunidades_simples",
          },
          {
            title: "Ud. Simples",
            description: "Breve texto introductorio del menú",
            permission: ["read", "SimpleCatalog"],
            href: "/catalogos/udsimples",
          },
          {
            title: "Subud Comp",
            description: "Repositorio de subunidades compuestas",
            permission: ["read", "MtSubspeciality"],
            href: "/catalogos/subunidades_compuestas",
          },
          {
            title: "Ud. Comp.",
            description: "Breve texto introductorio del menú",
            permission: ["read", "CompositeCatalog"],
            href: "/catalogos/udcompuestos",
          },
          {
            title: "Duplicados",
            description: "Duplicados",
            permission: ["read", "CompositeCatalog"],
            href: "/duplicados",
          },
        ],
      },
      {
        title: "Operaciones",
        description: "Catálogo de presupuesto de operaciones",
        secondSubItems: [
          {
            title: "Cat. Mat.",
            description: "Catálogo de Materiales",
            permission: ["read", "MaterialsCatalog"],
            href: "/operaciones/catalogo_materiales",
          },
          {
            title: "Cat. Serv.",
            description: "Catálogo de Servicios",
            permission: ["read", "MaterialsCatalog"],
            href: "/operaciones/catalogo_servicios",
          },
          {
            title: "Act. Cons.",
            description: "Catálogo de actividades de conservacion",
            permission: ["read", "ConservationActivity"],
            href: "/operaciones/actividad_conservacion",
          },
          {
            title: "Cat. Trab.",
            description: "Catálogo de Trabajos Compuestos",
            permission: ["read", "CompositeWork"],
            href: "/operaciones/catalogo_trabajos_compuestos",
          },
        ],
      },
    ],
  },
  {
    title: "Consultas y Reportes",
    firstSubItems: [
      {
        title: "Mant. Mayor", // Titulo modificado
        description: "Reportes de presupuesto de proyecto",
        secondSubItems: [
          {
            title: "Mediciones",
            description: "Reportes preconfigurados de mediciones de proyecto",
            thirdSubItems: [
              {
                title: "Med Ud Simp",
                description: "Breve texto introductorio del menú",
                href: "/consultas/mediciones/udsimplesxproyecto",
              },
              {
                title: "Med S Cons",
                description: "Breve texto introductorio del menú",
                href: "/consultas/mediciones/udsimplesconsolidadas",
              },
              {
                title: "Med Ud Comp",
                description: "Breve texto introductorio del menú",
                href: "/consultas/mediciones/udcompuestasxproyecto",
              },
              {
                title: "Med C Cons",
                description: "Breve texto introductorio del menú",
                href: "/consultas/mediciones/udcompuestasconsolidadas",
              },
            ],
          },
          // bloque eliminado
          {
            title: "Pres. Plan.", // Titulo modificado
            description: "Reportes de presupuesto de proyecto",
            thirdSubItems: [
              {
                title: "Pres Planif", // titulo modificado
                description: "Breve texto introductorio del menú",
                href: "/consultas/presupuesto/presupuestoxproyecto",
              },
              {
                title: "Pres Consol", // titulo modificado
                description: "Breve texto introductorio del menú",
                href: "/consultas/presupuesto/presupuesto_consolidado",
              },
              {
                title: "Ratios Inv.", // titulo modificado
                description: "Breve texto introductorio del menú",
                permission: ["read", "MtBusinessUnit"], // Esta query edita Uni Negocios
                href: "/consultas/presupuesto/ratioinversionconsolidados",
              },
            ],
          },
          {
            title: "Precios Plan.", // Titulo modificado
            description: "Consultas de precios por proyectos",
            thirdSubItems: [
              {
                title: "Comp P Simp",
                description: "Breve texto introductorio del menú",
                href: "/consultas/precios/simples",
              },
              {
                title: "Comp P Comp",
                description: "Breve texto introductorio del menú",
                href: "/consultas/precios/compuestas",
              },
            ],
          },
        ],
      },
      {
        title: "Operaciones", // Titulo modificado
        description: "Reportes de presupuesto de proyecto",
        secondSubItems: [
          {
            title: "Trab. Comp.", // titulo modificado
            description: "Breve texto introductorio del menú",
            href: "/consultas/operaciones/trabajoscompuestos",
          },
          {
            title: "Pres. Año", // titulo modificado
            description: "Breve texto introductorio del menú 2",
            href: "/consultas/operaciones/presupuestoconsolidadoporanio",
          },
          {
            title: "Rep. Glob.", // titulo modificado
            description: "Breve texto introductorio del menú 2",
            href: "/consultas/operaciones/reporteglobaldemateriales",
          },
        ],
      },
    ],
  },
  {
    title: "Usuario",
    firstSubItems: [
      {
        title: "Mi Perfil",
        description: "Configurar mi cuenta de usuario",
        href: "/usuarios/perfil",
      },
      {
        title: "Conf. Usr.",
        description: "Defina usuarios y sus privilegios",
        permission: ["read", "User"],
        href: "/usuarios",
      },
      {
        title: "Roles Usr.",
        description: "Configuración de roles",
        permission: ["read", "Rol"],
        href: "/usuarios/roles",
      },
      {
        title: "Permisos",
        description: "Configuración de permisos",
        permission: ["read", "Rol"],
        href: "/usuarios/permisos",
      },
      {
        title: "Ult. Activ.",
        description: "Ultima Actividad",
        href: "/usuarios/ultima_actividad",
      },
      {
        title: "Cerrar Ses.",
        description: "Salir de su cuenta de usuario",
        href: "#CerrarSesion",
      },
    ],
  },
  {
    title: "Documentación",
    href: "/documentacion",
  },
];

// Función para verificar permisos
const checkPermission = (ability: AppAbility, abilities: AppAbilities) => {
  const [action, subject] = abilities;
  return ability.can(action, subject);
};

// Función para filtrar ítems del menú
export const filterMenuItems = (
  items: NavbarItem[],
  ability: AppAbility,
): NavbarItem[] =>
  items.reduce((filteredItems: NavbarItem[], item: NavbarItem) => {
    if (item.permission && !checkPermission(ability, item.permission)) {
      return filteredItems;
    }

    if (item.firstSubItems) {
      const filteredFirstSubItems = item.firstSubItems.reduce(
        (
          filteredFirst: NavBarFirstSubItem[],
          firstSubItem: NavBarFirstSubItem,
        ) => {
          if (
            firstSubItem.permission &&
            !checkPermission(ability, firstSubItem.permission)
          ) {
            return filteredFirst;
          }

          if (firstSubItem.secondSubItems) {
            const filteredSecondSubItems = firstSubItem.secondSubItems.reduce(
              (
                filteredSecond: NavBarSecondSubItem[],
                secondSubItem: NavBarSecondSubItem,
              ) => {
                if (
                  secondSubItem.permission &&
                  !checkPermission(ability, secondSubItem.permission)
                ) {
                  return filteredSecond;
                }

                if (secondSubItem.thirdSubItems) {
                  const filteredThirdSubItems =
                    secondSubItem.thirdSubItems.reduce(
                      (
                        filteredThird: NavBarThirdSubItem[],
                        thirdSubItem: NavBarThirdSubItem,
                      ) => {
                        if (
                          thirdSubItem.permission &&
                          !checkPermission(ability, thirdSubItem.permission)
                        ) {
                          return filteredThird;
                        }

                        return [...filteredThird, thirdSubItem];
                      },
                      [],
                    );
                  secondSubItem.thirdSubItems = filteredThirdSubItems;
                }

                return [...filteredSecond, secondSubItem];
              },
              [],
            );
            firstSubItem.secondSubItems = filteredSecondSubItems;
          }

          return [...filteredFirst, firstSubItem];
        },
        [],
      );
      item.firstSubItems = filteredFirstSubItems;
    }

    return [...filteredItems, item];
  }, []);
