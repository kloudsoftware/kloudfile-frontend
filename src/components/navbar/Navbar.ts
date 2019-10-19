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
import {isLoggedIn} from "../../Util";

export class Navbar extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {
            root.addClass("flex-initial border-top-0");

            let target = "/";
            if(!isLoggedIn()) {
                target = "/login"
            }

            let routerLinkHome = new RouterLink(app, target, [
                app.k("h2", {value: "kloudfile", props: props, attrs: [cssClass("font-bold")]})
            ], "");

            let authLink = this.getAuthItem(app);


            app.eventPipeLine.registerEvent("toggleLogin", () => {
                const parent = authLink.parent;
               parent.removeChild(authLink);
               authLink = this.getAuthItem(app);
               parent.appendChild(authLink)
            });

            app.createElement("style", css, root);
            const navDiv = app.k("div");
            const div = app.k("div", {attrs: [cssClass("logo-container")]}, [
                routerLinkHome,
                app.k("p", {value: "frontend", props: props}),
                app.k("div", {attrs: [cssClass("navbarDivider")]}),
                navDiv,
                authLink
            ]);

            if (isLoggedIn()) {
                const el = new RouterLink(app, "/", [], "All Images", undefined, [cssClass("navbarlink border")]);
                navDiv.appendChild(el);
            }


            const http = app.get<HttpClient>("http");


            root.appendChild(div);
            return {
                remount: () => {
                }
            }
        }
    }

    private getAuthItem(app: VApp) {
        let authLink: VNode = null;
        if (isDefinedAndNotEmpty(window.localStorage.getItem("token"))) {
            const icon = app.k("img", {attrs: [src("ico/log-out.svg")]});

            authLink = app.k("div", {attrs: [cssClass("cursor-pointer")]}, [icon]);

            icon.addEventlistener("click", () => {
                window.localStorage.removeItem("token");
                app.eventPipeLine.callEvent("toggleLogin");
                app.router.resolveRoute("/login");
            });

        } else {
            authLink = new RouterLink(app, "/login", [
                app.k("img", {attrs: [src("ico/log-in.svg")]})
            ], "");
        }
        authLink.addClass("loginIcon float-right");

        return authLink;
    }
}
