import { Component, VApp, ComponentBuildFunc, Props, VNode, src, cssClass } from "@kloudsoftware/eisen"

export class HelloEisen extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            const div = app.k("div", { attrs: [cssClass("contentDiv")] }, [
                app.k("h1", { value: "Hello, eisen!" }),
            ]);
            
            root.appendChild(div);
            return {
                mounted: () => {
                }
            };
        }
    }
}