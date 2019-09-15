import { Component, VApp, ComponentBuildFunc, Props, VNode, src, cssClass, isDefinedAndNotEmpty, Router, id } from "@kloudsoftware/eisen"
import { handleAuthentication } from "../../common";
import { HttpClient } from "../../plugins/HttpClient";
import { Image } from "../image/Image";



export class Index extends Component {
    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {

            root.appendChild(app.k("h1" , {value: "All Images"}))

            let token = window.localStorage.getItem("token");
            if (!isDefinedAndNotEmpty(token)) {
                app.router.resolveRoute("/login")
            }

            const images = new Map<number, VNode>()

            const http = app.get<HttpClient>("http");
            http.peformGet("/api/list/").then((resp) => {
                resp.json().then((data: Array<ImageDTO>) => {
                    let row = app.k("div", { attrs: [cssClass("row")]})
                    data.forEach((item, index) => {
                        if (index > 12) {
                            return;
                        }

                        if (index % 4 === 0) {
                            root.appendChild(row)
                            row =  app.k("div", { attrs: [cssClass("row")]});
                        }

                        const img = app.k("img", { attrs: [src("https://kloudfile.io/res/" + item.fileUrl + "/?apiOnly=true")] });
                        const currImgContainer = app.k("div", {attrs: [cssClass("imgContainer", "column", "card form-card")]}, [img]);
                        images.set(item.id, currImgContainer);
                        img.addEventlistener("click", (ev, node) => {
                            const props = new Props(app);
                            props.setProp("data", item);
                            history.pushState({}, "", document.location.pathname)
                            app.router.resolveRoute("/img/" + item.fileUrl);
                        });
                        currImgContainer.appendChild(app.k("p", {value: item.viewCount.toString()}))

                        row.appendChild(currImgContainer);
                    })

                })
            }).catch(err => console.log(err));


            app.eventPipeLine.registerEvent("itemDeleted", (item) => {
                images.get(item).parent.removeChild(images.get(item));
            });


            console.log(token)
            return {
                mounted: () => {
                }
            };
        }
    }
}

export class ImageDTO {
    id: number;
    fileUrl: string;
    fileDeleteUrl: string;
    isViewAble: boolean;
    fileExtension: string;
    fileName: string;
    fileDateCreated: Date;
    fileDateUpdated: Date;
    viewCount: number;
}