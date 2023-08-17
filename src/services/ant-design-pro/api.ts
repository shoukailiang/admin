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
      ...params,
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

/** 更新用户 PUT /api/employee */
export async function updateUser(body:API.EmployeeListItem,options?: { [key: string]: any }) {
  return request<any>('/api/employee', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}

/** 新建用户 POST /api/user */
export async function addUser(body:API.EmployeeListItem,options?: { [key: string]: any }) {
  return request<API.EmployeeListItem>('/api/employee', {
    method: 'POST',
    data: body,
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


// 类别管理
/** 获取类别列表 GET /api/category/page */
export async function category(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  let res:any = await request<API.CategoryList>('/api/category/page', {
    method: 'GET',
    params: {
      ...params,
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

// 新增分类
export async function addCategoryDish(body:API.CategoryListItem,options?: { [key: string]: any }){
  return request<API.CategoryListItem>('/api/category', {
    method: 'POST',
    data: {
      name:body.name,
      sort:body.sort,
      type:body.type,
    },
    ...(options || {}),
  });
}

// 编辑分类
export async function updateCategory(body:API.CategoryListItem, options?: { [key: string]: any }) {
  return request<any>('/api/category', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}
// 删除分类
export async function removeCategory(options?: { [key: string]: any}) {
  return request<Record<string, any>>('/api/category', {
    method: 'DELETE',
    ...(options || {}),
  });
}


// 菜品管理
export async function dish(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  let res:any = await request<API.DishList>('/api/dish/page', {
    method: 'GET',
    params: {
      ...params,
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

export async function addDish(body:API.DishListItem,options?: { [key: string]: any }){
  return request<API.CategoryListItem>('/api/dish', {
    method: 'POST',
    data: {
      name:body.name,
      sort:body.sort,
    },
    ...(options || {}),
  });
}

// 编辑分类
export async function updateDish(body:API.DishListItem, options?: { [key: string]: any }) {
  return request<any>('/api/dish', {
    method: 'PUT',
    data: body,
    ...(options || {}),
  });
}
// 删除分类
export async function removeDish(options?: { [key: string]: any}) {
  const queryParams = new URLSearchParams(options).toString();
  const url = `/api/dish?${queryParams}`;
  return request<Record<string, any>>(url, {
    method: 'DELETE',
  });
}


export async function updateDishStatusBatch(options?: { [key: string]: any},type?:number) {
  const queryParams = new URLSearchParams(options).toString();
  const url = `/api/dish/status/${type}?${queryParams}`;
  return request<any>(url, {
    method: 'POST',
  });
}


// 获取菜品分类
export async function getCategoryList(options?: { [key: string]: any }) {
  return request<any>('/api/category/list?type=1', {
    method: 'GET',
    ...(options || {}),
  });
}


// 新增菜品
export async function addDishItem(body:API.DishListItem,options?: { [key: string]: any }){
  return request<API.DishListItem>('/api/dish', {
    method: 'POST',
    data: {
      name: body.name,
      price: body.price,
      categoryId: body.categoryId,
      flavors: body.flavors,
      description: body.description,
      image: body.image,
      code:"",
      status:1
    },
    ...(options || {}),
  });
}


// 根据菜单id获取菜品
export async function getDishItemById(id: string) {
  const url = `/api/dish/${id}`;
  return request<any>(url, {
    method: 'GET',
  });
}


// 更新菜品
export async function updateDishItem(body:API.DishListItem,options?: { [key: string]: any }){
  return request<API.DishListItem>('/api/dish', {
    method: 'PUT',
    data: {
      id: body.id,
      name: body.name,
      price: body.price,
      categoryId: body.categoryId,
      flavors: body.flavors,
      description: body.description,
      image: body.image,
      code:"",
      status:1
    },
    ...(options || {}),
  });
}
