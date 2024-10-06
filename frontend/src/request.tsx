import { store } from "./redux/store";
import { setError } from "./redux/reducers/game";

type Body = {[key: string]: any};

async function request(method: string, url: string, body?: Body) {
  try {
    let params: RequestInit = {
      method: method,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
    let fullUrl = `http://localhost:8800${url}`
    if (method == "GET" && body) {
      throw new Error("GET with body not supported yet")
    }
    if (body) {
      params["body"] = JSON.stringify(body);
    }

    const response = await fetch(fullUrl, params);
    const json = await response.json();
    const error = json["error"];
    if (error) {
      throw new Error(error);
    }
    return json;
  } catch (error: any) {
    store.dispatch(setError(error.toString()));
    return null;
  }
}

export function get(url: string) {
  return request("GET", url);
}

export function post(url: string, body: Body) {
  return request("POST", url, body);
}