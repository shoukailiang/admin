// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';



/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/employee/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      "username":"admin",
      "password":123456
    },
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/employee/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/employee/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/employee/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取员工列表 GET /api/employee/page */
export async function employee(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  let res:any = await request<API.EmployeeList>('/api/employee/page', {
    method: 'GET',
    params: {
      // 后端是page，所以多了这一步，antdesignpro是current
      page: params.current,
      pageSize: params.pageSize,
    },
    ...(options || {}),
  });
  // 这里也是为了匹配前端antdesign的格式，离谱
  const frontendData = {
    ...res.data,
    data: res.data.records, // 将 records 映射到 data
    success: res.data.searchCount, // 将 searchCount 映射到 success
  };
  return frontendData;
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.EmployeeListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.EmployeeListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
