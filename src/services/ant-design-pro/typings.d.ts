// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    id?:string;
    idNumber?:string;
    name?: string;
    username?:string;
    sex?:string;
    status?:number;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    code?:number;
    msg?:string;
    data?:object;
    map?:object;
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type EmployeeListItem = {
    id?: string;
    createTime?: string;
    createUser?: string;
    idNumber?: string;
    name?: string;
    password?: string;
    phone?: string;
    sex?: string;
    status?: number;
    updateTime?: string;
    updateUser?: string;
    username?: string;
  };

  type EmployeeList = {
    records?: EmployeeListItem[];
    /** 列表的内容总数 */
    total?: number;
    searchCount?: boolean;
  };


  // CategoryList
  type CategoryList ={
    records?: CategoryListItem[];
    /** 列表的内容总数 */
    total?: number;
    searchCount?: boolean;
  }

  type CategoryListItem = {
    id?: string;
    createTime?: string;
    createUser?: string;
    name?: string;
    sort?: number;
    type?: number;
    updateTime?: string;
    updateUser?: string;
  }

  // DishList
  type DishList ={
    records?: DishListItem[];
    /** 列表的内容总数 */
    total?: number;
    searchCount?: boolean;
  }

  type DishListItem = {
    id: string;
    categoryId?:string;
    categoryName?:string;
    code?:string;
    createTime?: string;
    createUser?: string;
    description?: string;
    name?: string;
    price: number;
    status?: number;
    updateTime?: string;
    updateUser?: string;
    sort?:number;
    code?:string;
    image?:string;
    flavors?:string[];
    copies?:any;
  }

  type SetMealListItem = {
    id?: string;
    categoryId?:string;
    categoryName?:string;
    code?:string;
    createTime?: string;
    createUser?: string;
    description?: string;
    name?: string;
    price?: number;
    status?: number;
    updateTime?: string;
    updateUser?: string;
    sort?:number;
    image?:string;
    setmealDishes?:setmealDishes[];
    copies?:number;
  }

  type SetMealList ={
    records?: SetMealListItem[];
    /** 列表的内容总数 */
    total?: number;
    searchCount?: boolean;
  }



  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}


