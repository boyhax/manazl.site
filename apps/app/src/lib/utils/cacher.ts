export function getCached(name) {
    let saved = localStorage.getItem(name);
    let data;
    let date;
    console.log("typeof saved :>> ", typeof saved, saved != "undefined");
    if (saved && saved != "undefined") {
      data = JSON.parse(saved);
      date = new Date(localStorage.getItem(name + "LastFetchDate"));
    }
    return { date, data };
  }
  export function setCache(name: string, data: any) {
    let string = JSON.stringify(data);
    localStorage.setItem(name, string);
    localStorage.setItem(name + "LastFetchDate", new Date().toISOString());
    return true;
  }

 