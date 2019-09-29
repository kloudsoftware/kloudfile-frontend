import {IRouter, isDefinedAndNotEmpty} from "@kloudsoftware/eisen";

export function handleAuthentication(router: IRouter): void {
    if (!isDefinedAndNotEmpty(localStorage.getItem("token"))) {
        router.resolveRoute("/login")
    }
}