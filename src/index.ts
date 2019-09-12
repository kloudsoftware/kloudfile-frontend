//vendor
import { VApp, Renderer, cssClass, Props } from "@kloudsoftware/eisen"

//own
import { HelloEisen } from './components/helloeisen/HelloEisen';

const app = new VApp("target", new Renderer());
app.init();

const container = app.createElement("div", undefined, app.rootNode, [cssClass("container")]);

const routerMnt = app.createElement("div", undefined, container);

const router = app.useRouter(routerMnt);
router.registerRoute("/", new HelloEisen())
router.resolveRoute(document.location.pathname).catch(() => router.resolveRoute("/"));

