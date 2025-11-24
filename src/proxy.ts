import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SIGN_IN_PATH = "/";
const DASHBOARD_PATH = "/dashboard";

const permissionRules: Array<{ prefix: string; permissionId: number }> = [
  { prefix: "/maestros", permissionId: 28 },
  { prefix: "/zonas_geograficas", permissionId: 28 },
  { prefix: "/elementos_carretera", permissionId: 44 },
  { prefix: "/tca", permissionId: 20 },
  { prefix: "/identificadores", permissionId: 54 },
  { prefix: "/datos_economicos", permissionId: 86 },
  { prefix: "/proyectos", permissionId: 86 },
  { prefix: "/operaciones/plan_cuenta_mayor", permissionId: 128 },
  { prefix: "/operaciones/grupo_materiales", permissionId: 128 },
  { prefix: "/operaciones/grupo_familia", permissionId: 128 },
  { prefix: "/operaciones/mude", permissionId: 108 },
  { prefix: "/operaciones/descripcion_por_centro_costo", permissionId: 138 },
  { prefix: "/operaciones/tipo_posicion_por_centro_costo", permissionId: 138 },
  { prefix: "/operaciones/clasificacion_cargos_nomina", permissionId: 138 },
  { prefix: "/operaciones/matriz_dotacion_personal", permissionId: 138 },
  { prefix: "/operaciones/areas_unidad_negocio", permissionId: 28 },
  { prefix: "/operaciones/repositorio_equipos", permissionId: 150 },
  { prefix: "/operaciones/proyectos", permissionId: 130 },
  { prefix: "/operaciones/catalogo_materiales", permissionId: 160 },
  { prefix: "/operaciones/catalogo_servicios", permissionId: 160 },
  { prefix: "/operaciones/actividad_conservacion", permissionId: 162 },
  { prefix: "/operaciones/catalogo_trabajos_compuestos", permissionId: 164 },
  { prefix: "/catalogos/deterioros", permissionId: 36 },
  { prefix: "/catalogos/subunidades_simples", permissionId: 68 },
  { prefix: "/catalogos/udsimples", permissionId: 6 },
  { prefix: "/catalogos/udcompuestos", permissionId: 8 },
  {
    prefix: "/consultas/presupuesto/ratioinversionconsolidados",
    permissionId: 28,
  },
  { prefix: "/usuarios", permissionId: 2 },
  { prefix: "/usuarios/roles", permissionId: 4 },
  { prefix: "/usuarios/permisos", permissionId: 4 },
];

const redirectTo = (req: NextRequest, path: string) =>
  NextResponse.redirect(new URL(path, req.url));

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const session = req.auth;
  const permisoIds = session?.user?.permisoIds ?? [];
  const permissions = new Set(permisoIds);

  if (pathname !== SIGN_IN_PATH && !session) {
    return redirectTo(req, SIGN_IN_PATH);
  }

  if (permissions.has(1)) {
    return NextResponse.next();
  }

  for (const { prefix, permissionId } of permissionRules) {
    if (pathname.startsWith(prefix) && !permissions.has(permissionId)) {
      return redirectTo(req, DASHBOARD_PATH);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|images/.*).*)",
  ],
};
