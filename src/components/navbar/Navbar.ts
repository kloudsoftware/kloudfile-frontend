import {
    Component,
    ComponentBuildFunc,
    ComponentProps,
    cssClass,
    isDefinedAndNotEmpty,
    Props,
    RouterLink,
    src,
    VApp,
    VNode
} from '@kloudsoftware/eisen';

import {css} from './navbarcss';
import {HttpClient} from '../../plugins/HttpClient';

export class Navbar extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {
            let loginLink = new RouterLink(app, "/login", [], "")
            let routerLinkHome = new RouterLink(app, "/", [
                app.k("h2", {value: "kloudfile", props: props})
            ], "");

            loginLink.addClass("loginIcon");

            let loginIcon: VNode = null;
            if (isDefinedAndNotEmpty(window.localStorage.getItem("token"))) {
                loginIcon = app.k("p", {value: window.localStorage.getItem("userName")})
            } else {
                loginIcon = app.k("img", {attrs: [src("login.svg")]});
            }

            loginLink.appendChild(loginIcon);

            app.createElement("style", css, root);
            const navDiv = app.k("div");
            const div = app.k("div", {attrs: [cssClass("logo-container")]}, [
                routerLinkHome,
                app.k("p", {value: "frontend", props: props}),
                app.k("div", {attrs: [cssClass("navbarDivider")]}),
                app.k("img", {attrs:[src("ico/anchor.svg")]}),
                navDiv
            ]);

            const el = new RouterLink(app, "/", [], "All Images", undefined, [cssClass("navbarlink border")]);
            navDiv.appendChild(el);

            const http = app.get<HttpClient>("http");
            navDiv.appendChild(loginLink);


            root.appendChild(div);
            return {
                remount: () => {
                }
            }
        }
    }
}
