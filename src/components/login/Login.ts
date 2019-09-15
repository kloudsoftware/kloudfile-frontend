import { Component, ComponentBuildFunc, ComponentProps, style, Router } from '@kloudsoftware/eisen';
import { VNode, Attribute, cssClass, id, labelFor, password, VInputNode } from '@kloudsoftware/eisen';
import { Props } from '@kloudsoftware/eisen';
import { VApp } from '@kloudsoftware/eisen';
import { css } from './logincss'
import { RouterLink } from '@kloudsoftware/eisen';
import { isDefinedAndNotEmpty } from '@kloudsoftware/eisen';
import { HttpClient } from "../../plugins/HttpClient";

class UserRegisterInfo {
    password: string;
    passwordConfirm: string;
}

export class Login extends Component {
    public build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props): ComponentProps => {

            root.addClass("container center-container");

            app.createElement("style", css, root);
            let userInfo = new UserRegisterInfo();
            let pwInput = app.k("input", { attrs: [id("iPassword"), password(), cssClass("user-input")] }) as VInputNode;

            let confirmBtn = app.k("span", { attrs: [cssClass("btn btn-confirm router-btn")], value: "Login" });

            pwInput.bindObject(userInfo, "password");

            const errorText = app.k("p", {
                value: "Incorrect username or password. Please try again.",
                attrs: [style("display: none"), cssClass("errorText")]
            });

            const div = app.k("div", { attrs: [cssClass("card form-card")] }, [
                app.k("div", { attrs: [cssClass("form-holder")] }, [
                    errorText,
                    app.k("h1", { value: "Log in", attrs: [cssClass("form-heading")] }),
                    app.k("label", { value: "Enter key", attrs: [labelFor("iPassword"), cssClass("user-input-label")] }),
                    pwInput,
                    confirmBtn,
                ])
            ]);

            confirmBtn.addEventlistener("click", (evt, btn) => {
                evt.preventDefault();
                window.localStorage.setItem("token", userInfo.password);
                app.router.resolveRoute("/")
                return true;
            });

            root.appendChild(div);

            return {
            }
        }
    }
}
