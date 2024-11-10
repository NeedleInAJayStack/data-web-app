import base64 from "base-64";
import formatISO from "date-fns/formatISO";

export async function getAuthToken(username, password) {
  let url = "/auth/token"
  let response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + base64.encode(username + ":" + password)
    },

  })
  if (response.ok) {
    return await response.json();
  } else {
    throw 'Invalid login'
  }
}

export async function getRecs(tag, token) {
  try {
    var url = "/recs"
    if (tag != "") {
      url = url + "?" + new URLSearchParams({tag: tag})
    }
    let response = await fetch(url, {
    method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

export async function getHis(id, start, end, token) {
  try {
    let url = `/recs/${id}/history?` + new URLSearchParams({
      start: start,
      end: end,
    })
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

export async function postHis(id, ts, value, token) {
  try {
    let body = {
      ts: formatISO(ts), // We use date-fns implementation here to avoid milliseconds (Swift hates them and me)
      value: value
    };
    let url = `/recs/${id}/history`
    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.log(e);
  }
}