import * as auth from "../auth.json";

export let config = {
    "token": (<any>auth).token,
    "prefix": "?",
};