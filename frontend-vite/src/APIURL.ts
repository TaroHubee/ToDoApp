export const DBURL = "http://localhost:3000"
export const APIURL_Task = {
    change: `${DBURL}/task`,
    post: `${DBURL}/task`
}
export const APIURL_Category = {
    get: `${DBURL}/category`,
}

export const APIURL_Status = {
    get: `${DBURL}/status`,
    putIsDone: `${DBURL}/status/changeIsDone`,
    getIsDone: `${DBURL}/status/isDone`
}