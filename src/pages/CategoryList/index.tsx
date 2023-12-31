import { addCategoryDish, removeCategory, category, updateCategory } from '@/services/ant-design-pro/api';
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
import { Button, Drawer, Modal, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
/**
 * @en-US Add node
 * @zh-CN 添加菜品类别
 * @param fields
 */
const handleAddDish = async (fields: API.CategoryListItem) => {
  console.log(fields)
  const hide = message.loading('正在添加');
  try {
    await addCategoryDish({
      name:fields.name,
      sort:fields.sort,
      type:1
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
 * @en-US Add node
 * @zh-CN 添加菜品类别
 * @param fields
 */
const handleAddPackage = async (fields: API.CategoryListItem) => {
  console.log(fields)
  const hide = message.loading('正在添加');
  try {
    await addCategoryDish({
      name:fields.name,
      sort:fields.sort,
      type:2
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
    await updateCategory({...fields});
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
    await removeCategory({
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


const DeleteCategory = async (fields:API.CategoryListItem)=>{
  const hide = message.loading('Configuring');
  try {
    await removeCategory({
      id: fields.id,
    });
    hide();

    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
}


const CategoryList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [categoryType, setCategoryType] = useState<number>(1);// 1 菜品分类 2 套餐分类
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

  const [record,setRecord] = useState<API.CategoryListItem>({})

  // 模态框
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('你确定删除分类吗？');

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setModalText('你确定删除分类吗？');
    setConfirmLoading(true);
    await DeleteCategory(record);
    setRecord({});
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
    setRecord({});
  };

  const columns: ProColumns<API.CategoryListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.categoryManagement.categoryName"
          defaultMessage="Rule name"
        />
      ),
      dataIndex: 'name',
      tip: '分类名称',
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
      title: <FormattedMessage id="pages.categoryManagement.categoryType" defaultMessage="Description" />,
      dataIndex: 'type',
      // ==1 现实菜品分类，==2显示套餐分类
      renderText: (val) => val===1?'菜品分类':'套餐分类',
    },
    {
      title: (
        <FormattedMessage
          id="pages.categoryManagement.operationTime"
          defaultMessage="pages.categoryManagement.operationTime"
        />
      ),
      dataIndex: 'updateTime',
    },
    {
      title: <FormattedMessage id="pages.categoryManagement.sort" defaultMessage="sort" />,
      dataIndex: 'sort',
      hideInForm: true,
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
          <FormattedMessage id="pages.categoryManagement.edit" defaultMessage="edit" />
        </a>,
        <a key="" style={{color:'red'}}
        onClick={()=>{
          showModal();
          setRecord(record);
        }}
        // onClick={()=>{
        //   DeleteCategory(record);
        //   if(actionRef.current){
        //     actionRef.current.reload();
        //   }
        // }}
        >
          <FormattedMessage id="pages.categoryManagement.delete" defaultMessage="delete" />
        </a>,
      ],
    },
  ];






  return (
    <PageContainer>
      <ProTable<API.CategoryListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.categoryManagement.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // 新建菜品分类
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCategoryType(1);
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.categoryManagement.addCategory" defaultMessage="New" />
          </Button>,
          // 新增套餐分类
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCategoryType(2);
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.categoryManagement.addCategorySet" defaultMessage="New" />
          </Button>,
        ]}
        request={category}
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
        title={categoryType===1?'新增菜品分类':'新增套餐分类'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          if(categoryType===1){
            const success = await handleAddDish(value as API.CategoryListItem);
            if (success) {
              handleModalOpen(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }else{
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
          <ProDescriptions<API.CategoryListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.CategoryListItem>[]}
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

export default CategoryList;
