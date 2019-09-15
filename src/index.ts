//vendor
import { VApp, Renderer, cssClass, Props, MiddleWare, isDefinedAndNotEmpty } from "@kloudsoftware/eisen"

//own
import { Index } from './components/index/Index';
import { Login } from "./components/login/Login";
import { HttpClient } from "./plugins/HttpClient";
import { Navbar } from "./components/navbar/Navbar";
import { Image } from "./components/image/Image";

const app = new VApp("target", new Renderer());
app.init();
app.use("http", new HttpClient("https://kloudfile.io", app))


app.mountComponent(new Navbar(), app.rootNode, new Props(app));

const container = app.createElement("div", undefined, app.rootNode, [cssClass("container")]);

const routerMnt = app.createElement("div", undefined, container);

const router = app.useRouter(routerMnt);

router.registerRoute("/", new Index())
router.registerRoute("/login", new Login())
router.registerRoute("/img/{id}", new Image());

if(isDefinedAndNotEmpty(localStorage.getItem("token"))) {
    router.resolveRoute(document.location.pathname).catch(() => router.resolveRoute("/"));
} else {
    router.resolveRoute("/login")
}


