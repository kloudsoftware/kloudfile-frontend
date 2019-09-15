import { isDefinedAndNotEmpty, Router, IRouter } from "@kloudsoftware/eisen";

export function handleAuthentication(router: IRouter): void {
    if(!isDefinedAndNotEmpty(localStorage.getItem("token"))) {
        router.resolveRoute("/login")
    }
}