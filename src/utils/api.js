import network from './network';


// 登录
export function login(data){
    return network({
        url:`/login`,
        method: "post",
        data
    });
}

// 注册

export function register(data){
    return network({
        url:`/register`,
        method:"post",
        data
    })
}

// 密码重置
export function queryTaskList(params){
    return network({
        url:`/queryTaskList/`,
        method:"get",
        params
    })
}


// 修改内容
export function editContent(data){
    return network({
        url:`/editContent`,
        method:"put",
        data
    })
}



