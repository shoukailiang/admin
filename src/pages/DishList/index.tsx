import { addDish, dish, removeDish, updateDish } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Image, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
/**
 * @en-US Add node
 * @zh-CN 添加菜品类别
 * @param fields
 */
const handleAddDish = async (fields: API.CategoryListItem) => {
  console.log(fields);
  const hide = message.loading('正在添加');
  try {
    await addDish({
      name: fields.name,
      sort: fields.sort,
    });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新类别
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateDish({ ...fields });
    hide();

    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除类别
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.CategoryListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeDish({
      id: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const DeleteCategory = async (fields: API.CategoryListItem) => {
  const hide = message.loading('Configuring');
  try {
    await removeDish({
      id: fields.id,
    });
    hide();

    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

const DishList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [categoryType, setCategoryType] = useState<number>(1); // 1 菜品分类 2 套餐分类
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CategoryListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.CategoryListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const [record, setRecord] = useState<API.CategoryListItem>({});

  // 模态框
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('你确定删除分类吗？');

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText('你确定删除分类吗？');
    // setConfirmLoading(true);
    DeleteCategory(record);
    setRecord({});
    setOpen(false);
    // setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    setRecord({});
  };

  const columns: ProColumns<API.EmployeeListItem>[] = [
    {
      title: <FormattedMessage id="pages.dishManagement.dishName" defaultMessage="dishName" />,
      dataIndex: 'name',
      tip: '菜品名称',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      // 图片
      title: <FormattedMessage id="pages.dishManagement.dishImage" defaultMessage="菜品图片" />,
      dataIndex: 'image',
      // img src 拼接上http://162.14.124.240:8080/common/download?name=，然后大小小一点
      renderText: (val: string) => (
        <Image src={'http://162.14.124.240:8080/common/download?name=' + val} width={100} />
      ),
    },
    {
      title: <FormattedMessage id="pages.dishManagement.dishCategory" defaultMessage="菜品分类" />,
      dataIndex: 'categoryName',
    },
    {
      title: <FormattedMessage id="pages.dishManagement.dishPrice" defaultMessage="菜品价格" />,
      dataIndex: 'price',
      // 价格除以100，前面加上人民币符号
      renderText: (val: number) => `￥${val / 100}`,
    },
    {
      // 售卖状态
      title: <FormattedMessage id="pages.dishManagement.dishStatus" defaultMessage="售卖状态" />,
      dataIndex: 'status',
      // 1是起售 2是停售，不用国际化
      valueEnum: {
        1: { text: '起售', status: 'Success' },
        0: { text: '停售', status: 'Error' },
      },
    },
    {
      // 最后操作时间
      title: (
        <FormattedMessage
          id="pages.dishManagement.lastOperationTime"
          defaultMessage="最后操作时间"
        />
      ),
      dataIndex: 'updateTime',
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          {/* 修改 */}
          <FormattedMessage id="pages.dishManagement.edit" defaultMessage="update" />
        </a>,
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          {/* 停售*/}
          <FormattedMessage id="pages.dishManagement.stopSelling" defaultMessage="update" />
        </a>,
        <a
          key=""
          style={{ color: 'red' }}
          onClick={() => {
            showModal();
            setRecord(record);
          }}
        >
          <FormattedMessage id="pages.categoryManagement.delete" defaultMessage="delete" />
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.DishListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.dishManagement.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => {}}>
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.dishManagement.batchDelete" defaultMessage="New" />
          </Button>,
          <Button type="primary" key="primary" onClick={() => {}}>
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.dishManagement.batchShelf" defaultMessage="New" />
          </Button>,
          <Button type="primary" key="primary" onClick={() => {}}>
            <PlusOutlined />{' '}
            <FormattedMessage id="pages.dishManagement.batchShelf" defaultMessage="New" />
          </Button>,
          <Button type="primary" key="primary" onClick={() => {}}>
            新建菜品
          </Button>,
        ]}
        request={dish}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        // categoryType===1 菜品分类
        // categoryType===2 套餐分类
        title={categoryType === 1 ? '新增菜品分类' : '新增套餐分类'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          if (categoryType === 1) {
            const success = await handleAddDish(value as API.CategoryListItem);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          } else {
            const success = await handleAddPackage(value as API.CategoryListItem);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      >
        <ProFormText
          label="分类名称"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.categoryManagement.categoryName"
                  defaultMessage="categoryName is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormText
          label="排序"
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.categoryManagement.sort"
                  defaultMessage="sort is required"
                />
              ),
            },
          ]}
          width="md"
          name="sort"
        />
      </ModalForm>

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.EmployeeListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.EmployeeListItem>[]}
          />
        )}
      </Drawer>
      {/* model框 */}
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
    </PageContainer>
  );
};

export default DishList;
