const host = "localhost";
const port = 6969;
const url = endpoint => `http://${host}:${port}/api/${endpoint}`;
//'content-type': 'application/json'

export default {

    fetch: (opt, action) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            // credentials: 'include'
        })
            .then(res => res.json())
            .then(response => {
                action(response);
            });
    },

    fetchNoContent: (opt, action) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            // credentials: 'include'
        })
            .then(response => {
            action(response);
        });
    },

    fetchHandleError: (opt, action, errorCallback) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            // credentials: 'include'
        })
            .then(res => res.json())
            .then(response => {
                action(response);
            })
            .catch(errorCallback);
    },

    endpoints: {

//      ====== USER ========================================

        register: (data) => ({
            path: url(`user/register`),
            method: "POST",
            body: JSON.stringify(data)
        }),

        signIn: (data) => ({
            path: url(`user/login`),
            method: "POST",
            body: JSON.stringify(data)
        }),

        getUserData: (token) => ({
            path: url(`user`),
            method: "GET",
            headers: {
                "token": token
            }
        }),

        signOut: (token) => ({
            path: url(`user/logout`),
            method: "POST",
            headers: {
                "token": token
            },
            body: token
        }),

//      ====== MEMOS =======================================

        addMemo: (token, data) => ({
            path: url(`memos/memo`),
            method: "POST",
            headers: {
                "token": token
            },
            body: JSON.stringify(data)
        }),

        getMemo: (token, id) => ({
            path: url(`memos/memo`),
            method: "GET",
            headers: {
                "token": token
            },
            body: id
        }),

        deleteMemo: (token, id) => ({
            path: url(`memos/memo`),
            method: "DELETE",
            headers: {
                "token": token
            },
            body: id
        }),

        fetchMemos: (token) => ({
            path: url(`memos/memo/all`),
            method: "GET",
            headers: {
                "token": token
            }
        }),


//      ====== TODOS =======================================

        addTodo: (token, data) => ({
            path: url(`memos/todolist`),
            method: "POST",
            headers: {
                "token": token
            },
            body: JSON.stringify(data)
        }),

        putTodo: (token, data) => ({
            path: url(`memos/todolist`),
            method: "PUT",
            headers: {
                "token": token
            },
            body: JSON.stringify(data)
        }),

        getTodo: (token, id) => ({
            path: url(`memos/todolist`),
            method: "GET",
            headers: {
                "token": token
            },
            body: id
        }),

        deleteTodo: (token, id) => ({
            path: url(`memos/todolist`),
            method: "DELETE",
            headers: {
                "token": token
            },
            body: id
        }),

        fetchTodos: (token) => ({
            path: url(`memos/todolist/all`),
            method: "GET",
            headers: {
                "token": token
            }
        })
    }
}