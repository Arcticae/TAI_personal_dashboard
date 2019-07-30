const host = "localhost";
const port = 6969;
const url = endpoint => `http://${host}:${port}/api/${endpoint}`;
//'content-type': 'application/json'

export default {

    fetch: (opt, action) => {
        console.log(opt);
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

    fetchNoContent: (opt) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            // credentials: 'include'
        })
            .then(response => {
            console.log(response);
        });
    },

    endpoints: {

//      ====== USER ========================================

        register: (data) => ({
            path: url(`user/register`),
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-Type": 'application/json'}
        }),

        signIn: (data) => ({
            path: url(`user/login`),
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-Type": 'application/json'}
        }),

        getUserData: (token) => ({
            path: url(`user`),
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            }
        }),

        signOut: (token) => ({
            path: url(`user/logout`),
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "token": token.token
            },
            body: JSON.stringify(token)
        }),

//      ====== MEMOS =======================================

        addMemo: (token, data) => ({
            path: url(`memos/memo`),
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            },
            body: JSON.stringify(data)
        }),

        getMemo: (token, id) => ({
            path: url(`memos/memo/${id}`),
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            }
        }),

        deleteMemo: (token, id) => ({
            path: url(`memos/memo/${id}`),
            method: "DELETE",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            }
        }),

        fetchMemos: (token) => ({
            path: url(`memos/memo/all`),
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            }
        }),


//      ====== TODOS =======================================

        addTodo: (token, data) => ({
            path: url(`memos/todolist`),
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            },
            body: JSON.stringify(data)
        }),

        putTodo: (token, data) => ({
            path: url(`memos/todolist`),
            method: "PUT",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            },
            body: JSON.stringify(data)
        }),

        getTodo: (token, id) => ({
            path: url(`memos/todolist`),
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            },
            body: id
        }),

        deleteTodo: (token, id) => ({
            path: url(`memos/todolist`),
            method: "DELETE",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            },
            body: id
        }),

        fetchTodos: (token) => ({
            path: url(`memos/todolist/all`),
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            },
        }),

//       ====== GOOGLE =======================================

        googleGetLink: () => ({
            path: url(`googleCalendar/auth`),
            method: "GET",
            headers: {}
        }),


  // @path POST /api/googleCalendar/auth
  // @desc Post code to authorize this app to use user's calendars
  // @access Private
  // @header <token>
  // @body <accessCode>
        googleAuthorize: (token, code) => ({
            path: url(`googleCalendar/auth`),
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "token": token
            },
            body: code
        })
    }
}