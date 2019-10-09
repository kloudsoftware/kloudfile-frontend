import {
    Component,
    ComponentBuildFunc,
    cssClass,
    isDefinedAndNotEmpty,
    Props,
    src,
    VApp,
    VNode
} from "@kloudsoftware/eisen"
import {HttpClient} from "../../plugins/HttpClient";


export class Index extends Component {
    imageList: Array<ImageDTO> = [];
    imageMounts: Map<number, VNode> = new Map<number, VNode>();
    currentPageNum = 0;
    pageSize = 16;

    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {

            root.appendChild(app.k("h1", {value: "All Images"}));

            let token = window.localStorage.getItem("token");
            if (!isDefinedAndNotEmpty(token)) {
                app.router.resolveRoute("/login")
            }


            const http = app.get<HttpClient>("http");
            http.peformGet("/api/list/").then(async (resp) => {
                this.imageList = await resp.json();
                this.buildImages(app, root);
            }).catch(err => console.log(err)).then(() => {
                const pagination = app.k("div");

                const pageForward = app.k("div", {
                    value: "Forward",
                    attrs: [cssClass("btn btn-confirm router-btn btnImageCopy")]
                });

                const numPages = Math.ceil(this.imageList.length / this.pageSize);

                const countPageProps = new Props(app);

                countPageProps.setProp("currentPage", this.currentPageNum);

                const countPages = app.k("p", {value: "{{ currentPage }} / {{ maxPages }}", props: countPageProps});

                const pageBackward = app.k("div", {
                    value: "Backward",
                    attrs: [cssClass("btn btn-confirm router-btn btnImageCopy")]
                });


                pageForward.addEventlistener("click", (ev) => {
                    console.log(this.imageList)
                });

                pagination.appendChild(pageBackward);
                pagination.appendChild(countPages);
                pagination.appendChild(pageForward);
                root.appendChild(pagination);
            });

            app.eventPipeLine.registerEvent("itemDeleted", (item: ImageDTO) => {
                this.imageMounts.get(item.id).parent.removeChild(this.imageMounts.get(item.id));
            });


            return {
                mounted: () => {
                },
                remount(): void {
                }
            };
        }
    }

    private buildImages(app: VApp, root: VNode, startValue?: number) {
        let row = app.k("div", {attrs: [cssClass("row")]});
        this.imageList.forEach((item, index) => {
            if (index >= this.pageSize) {
                return;
            }

            if (index % 4 === 0) {
                root.appendChild(row);
                row = app.k("div", {attrs: [cssClass("row")]});
            }

            const img = app.k("img", {attrs: [src("https://kloudfile.io/res/" + item.fileUrl + "/?apiOnly=true")]});
            const currImgContainer = app.k("div", {attrs: [cssClass("imgContainer", "column", "card form-card")]}, [img]);
            this.imageMounts.set(item.id, currImgContainer);
            img.addEventlistener("click", () => {
                history.pushState({}, "", document.location.pathname);
                app.router.resolveRoute("/img/" + item.fileUrl).catch(() => {
                    console.error("Routing to img failed");
                    app.router.resolveRoute("/")
                });
            });
            currImgContainer.appendChild(app.k("p", {value: item.viewCount.toString()}));

            row.appendChild(currImgContainer);
        });
        root.appendChild(row);
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
