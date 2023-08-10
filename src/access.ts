/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  console.log(currentUser)
  // 后台返回的数据没有access,这里判断name是不是admin
  if (currentUser?.username === 'admin') {
    currentUser.access = 'admin';
  }
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
