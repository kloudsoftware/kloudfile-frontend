import { Component, VApp, ComponentBuildFunc, Props, VNode, src, cssClass } from "@kloudsoftware/eisen"
import { HttpClient } from "../../plugins/HttpClient";
import { ImageDTO } from "../index/Index";

export class Image extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            root.addClass("container center-container");
            const url = props.getProp("_id")
            const http = app.get<HttpClient>("http");

            const img = app.k("img", { attrs: [src("https://kloudfile.io/res/" + url + "/?apiOnly=true")] });
            const currImgContainer = app.k("div", { attrs: [cssClass("imgSoloContainer")] }, [img]);

            let deleteBtn = app.k("span", { attrs: [cssClass("btn btn-delete router-btn btnImageDelete")], value: "Delete Image" });


            http.peformGet("/api/list/").then(async (resp) => {
                const json = await resp.json() as Array<ImageDTO>;
                const list = json.filter(el => el.fileUrl === url);

                if (list.length < 1) {
                    console.error("Image not found");
                    app.router.resolveRoute("/");
                }

                const item = list[0];

                deleteBtn.addEventlistener("click", () => {
                    console.log(item.fileDeleteUrl);
                    http.peformGet("/api/delete/" + item.fileDeleteUrl).then(() => {
                        app.eventPipeLine.registerEvent("itemDeleted", () => {})
                        app.eventPipeLine.callEvent("itemDeleted", item.id);
                        app.router.resolveRoute("/")

                    }).catch((e) => console.error(e));
                })
            })

            const div = app.k("div", { attrs: [cssClass("card form-card")] }, [
                app.k("div", { attrs: [cssClass("form-holder")] }, [
                    currImgContainer,
                    deleteBtn
                ])
            ]);

            root.appendChild(div);

            return {
                mounted: () => {
                }
            };
        }
    }
}