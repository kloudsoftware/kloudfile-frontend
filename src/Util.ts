import {isDefinedAndNotEmpty} from "@kloudsoftware/eisen";

export function isLoggedIn() {
    let token = window.localStorage.getItem("token");
    return (isDefinedAndNotEmpty(token));
}
