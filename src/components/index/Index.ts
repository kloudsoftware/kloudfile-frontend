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

const DIRECTION = {
    FORWARD: 0,
    BACKWARD: 1
};

export class Index extends Component {
    private imageList: Array<ImageDTO> = [];
    private imageMounts: Map<number, VNode> = new Map<number, VNode>();
    private currentPageNum = 1;
    private pageSize = 16;
    private pages: Map<number, VNode> = new Map<number, VNode>();
    private pageCountProps: Props;

    build(app: VApp): ComponentBuildFunc {
        return (root: VNode, props: Props) => {
            app.eventPipeLine.registerEvent("toggleLogin", () => {
                Array.from(this.pages.entries()).forEach(value => {
                    const node = value[1];
                    node.parent.removeChild(node);
                });
                this.pages = new Map<number, VNode>();
            });

            let token = window.localStorage.getItem("token");

            if (!isDefinedAndNotEmpty(token) || token === undefined) {
                console.log("rerouting");
                app.router.resolveRoute("/login")
            } else {
                console.log("not rerouting");
            }

            this.buildComponent(app, root);

            const instance = this;

            return {
                mounted: () => {
                },
                remount(): void {
                    token = window.localStorage.getItem("token");
                    if (!isDefinedAndNotEmpty(token) || token === undefined) {
                        console.log("rerouting");
                        app.router.resolveRoute("/login");
                        return;
                    } else {
                        root.$getChildren().forEach(child => root.removeChild(child));
                        instance.buildComponent(app, root);
                    }
                }
            };
        }
    }

    private buildComponent(app: VApp, root: VNode) {
        root.appendChild(app.k("h1", {value: "All Images"}));

        const imageRoot = app.k("div");
        const imageRootContainer = app.k("div", {}, [imageRoot]);
        this.pages.set(this.currentPageNum, imageRoot);

        const http = app.get<HttpClient>("http");
        http.peformGet("/api/list/").then(async (resp) => {
            if (resp.status === 400) {
                return;
            }
            this.imageList = await resp.json();
            this.buildImages(app, imageRoot, 0);
        }).catch(err => console.log(err)).then(() => {
            const pagination = app.k("div", {attrs: [cssClass("paginationContainer")]});

            const pageForward = app.k("div", {
                value: "Forward",
                attrs: [cssClass("btn btnPagination router-btn")]
            });


            this.pageCountProps = new Props(app);

            this.pageCountProps.setProp("currentPage", this.currentPageNum);
            this.pageCountProps.setProp("maxPages", this.getMaxPages());

            const countPages = app.k("p", {
                value: "{{ currentPage }} / {{ maxPages }}",
                props: this.pageCountProps,
                attrs: [cssClass("paginationText")]
            });


            const pageBackward = app.k("div", {
                value: "Backward",
                attrs: [cssClass("btn btnPagination router-btn")]
            });


            pageForward.addEventlistener("click", () => {
                this.doPagination(DIRECTION.FORWARD, imageRootContainer, app);
            });

            pageBackward.addEventlistener("click", () => {
                this.doPagination(DIRECTION.BACKWARD, imageRootContainer, app);
            });

            pagination.appendChild(pageBackward);
            pagination.appendChild(countPages);
            pagination.appendChild(pageForward);
            root.appendChild(pagination);
        });

        root.appendChild(imageRootContainer);


        app.eventPipeLine.registerEvent("itemDeleted", (item: ImageDTO) => {
            const itemIdx = this.imageList.map(it => it.id).indexOf(item.id);
            this.imageList.splice(itemIdx, 1);
            imageRootContainer.removeChild(this.pages.get(this.currentPageNum));
            this.pages.delete(this.currentPageNum);
            const newRoot = app.k("div");
            this.pages.set(this.currentPageNum, newRoot);
            this.buildImages(app, newRoot, this.currentPageNum * this.pageSize);
            imageRootContainer.appendChild(newRoot);
        });
    }

    private getMaxPages(): number {
        return Math.ceil(this.imageList.length / this.pageSize);
    }

    private doPagination(direction: number, mount: VNode, app: VApp) {
        const oldNum = this.currentPageNum;
        if (direction === DIRECTION.FORWARD) {
            if (this.currentPageNum === this.getMaxPages()) {
                return;
            }
            this.currentPageNum++;
        } else {
            if (this.currentPageNum === 1) {
                return;
            }

            this.currentPageNum--;
        }

        this.pages.get(oldNum).addClass("invisible");

        if (this.pages.get(this.currentPageNum) === undefined) {
            let imgRoot = app.k("div");
            this.pages.set(this.currentPageNum, imgRoot);
            this.buildImages(app, imgRoot, this.currentPageNum * this.pageSize);
            mount.appendChild(imgRoot)
        } else {
            this.pages.get(this.currentPageNum).removeClass("invisible")
        }

        this.pageCountProps.setProp("currentPage", this.currentPageNum)
    }

    private buildImages(app: VApp, root: VNode, startValue: number = 0) {
        let row = app.k("div", {attrs: [cssClass("row")]});
        this.imageList.slice(startValue).forEach((item, index) => {
            if (index >= this.pageSize) {
                return;
            }

            if (index % 4 === 0) {
                root.appendChild(row);
                row = app.k("div", {attrs: [cssClass("row")]});
            }

            const img = app.k("img", {attrs: [src("https://kloudfile.io/res/" + item.fileUrl + "/?apiOnly=true" + "&small=true")]});
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
